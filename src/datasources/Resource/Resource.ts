import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { ValidationError } from 'apollo-server-lambda';
import { Record } from 'neo4j-driver';
import { format } from 'util';

import request from '../../services/neo4j/request';
import { getFileContents } from '../../services/file';
import {
    Category,
    SubCategory,
    StatusID as ProjectStatusID,
} from '../Project/types';
import { IContext } from '../../services/graphql/types';
import {
    FileFormat,
    IDataSource,
    SubtitlesFileFormats,
    Status,
    ItemStatus,
    TranslationStatus,
    TranslationType,
    TranslationService,
    ImportOptions,
    StatusID,
    ItemStatusID,
    ItemContextLabel,
    TranslationStatusID,
} from './types';
import {
    FILE_FORMATS,
    ITEM_STATUSES,
    STATUSES,
    TRANSLATION_STATUSES,
    TRANSLATION_TYPES,
    TRANSLATION_SERVICES,
    ITEM_CONTEXT_LABELS,
    FILE_ELEMENTS_LIMIT,
} from './config';
import {
    IMPORT_RESOURCE_QUERY,
    CREATE_TRANSLATION_QUERY,
    UPDATE_TRANSLATION_QUERY,
    DELETE_TRANSLATION_QUERY,
    GET_RESOURCE_QUERY,
    GET_APPROVED_TRANSLATIONS,
} from './queries';
import { IElement } from '../../services/parser/types';
import { ABCId } from '../ABC/types';
import { determine } from '../Project/category';

class Resource extends DataSource implements IDataSource {
    private context: IContext;

    initialize(config: DataSourceConfig<IContext>): void {
        this.context = config.context;
    }

    public getFileFormats(
        category: Category,
        subCategory?: SubCategory | null
    ): FileFormat[] {
        const categoryFileFormats = FILE_FORMATS[category];

        if (!categoryFileFormats) {
            throw new Error('File formats not found.');
        }

        if (!subCategory) {
            if (Array.isArray(categoryFileFormats)) {
                return categoryFileFormats as FileFormat[];
            }
            throw new Error('Subtitles subCategory not provided.');
        }

        const subCategoryFileFormats = (categoryFileFormats as SubtitlesFileFormats)[
            subCategory
        ];

        if (!subCategoryFileFormats) {
            throw new Error('File formats not found.');
        }

        return subCategoryFileFormats;
    }

    public getFileFormatByCode(
        code: string,
        category: Category,
        subCategory?: SubCategory | null
    ): FileFormat {
        const fileFormat = this.getFileFormats(category, subCategory).find(
            (fileFormat) => fileFormat.code === code
        );

        if (!fileFormat) {
            throw new Error('File format not found');
        }

        return fileFormat;
    }

    public getFileFormatByExtension(
        extension: string,
        category: Category,
        subCategory?: SubCategory | null
    ): FileFormat {
        const fileFormat = this.getFileFormats(
            category,
            subCategory
        ).find((fileFormat) => fileFormat.extensions.includes(extension));

        if (!fileFormat) {
            throw new Error('File format not found');
        }

        return fileFormat;
    }

    public getStatusById(id: number): Status {
        const status = STATUSES.find((status) => status.id === id);

        if (!status) {
            throw new Error('Resource status not found');
        }

        return status;
    }

    public getItemStatusById(id: number): ItemStatus {
        const itemStatus = ITEM_STATUSES.find(
            (itemStatus) => itemStatus.id === id
        );

        if (!itemStatus) {
            throw new Error('Resource item status not found.');
        }

        return itemStatus;
    }

    public getItemStatuses(): ItemStatus[] {
        return ITEM_STATUSES;
    }

    public getTranslationStatusById(id: number): TranslationStatus {
        const translationStatus = TRANSLATION_STATUSES.find(
            (status) => status.id === id
        );

        if (!translationStatus) {
            throw new Error('Translation status not found.');
        }

        return translationStatus;
    }

    public validateTranslationStatusId(id: number): void {
        try {
            this.getTranslationStatusById(id);
        } catch (e) {
            throw new ValidationError('Translation status ID is not valid.');
        }
    }

    public getTranslationTypeById(id: number): TranslationType {
        const translationType = TRANSLATION_TYPES.find(
            (type) => type.id === id
        );

        if (!translationType) {
            throw new Error('Translation type not found.');
        }

        return translationType;
    }

    public validateTranslationTypeId(id: number): void {
        try {
            this.getTranslationTypeById(id);
        } catch (e) {
            throw new ValidationError('Translation type ID is not valid.');
        }
    }

    public getTranslationServiceById(id: number): TranslationService {
        const translationService = TRANSLATION_SERVICES.find(
            (service) => service.id === id
        );

        if (!translationService) {
            throw new Error('Translation service not found.');
        }

        return translationService;
    }

    public validateTranslationServiceId(id: number): void {
        try {
            this.getTranslationServiceById(id);
        } catch (e) {
            throw new ValidationError('Translation service ID is not valid.');
        }
    }

    public async import(
        buffer: Buffer,
        options: ImportOptions
    ): Promise<string> {
        const contents = getFileContents(buffer, options.encoding);
        const extension = contents.extension || options.extension;
        if (!extension) {
            throw new Error('Could not recognize file format.');
        }

        const fileFormat = this.getFileFormatByExtension(
            extension,
            options.projectCategory,
            options.projectSubCategory
        );

        let elements: IElement[] = [];
        try {
            elements = await fileFormat.parser().parse(contents.contents, {
                languageCode: options.language.code,
            });
        } catch (e) {
            this.context.logger.log(
                'error',
                `Invalid file (${extension}): ${e.message}`
            );
            throw new Error('Invalid file.');
        }

        if (!(elements && elements.length > 0)) {
            throw new Error('Nothing to translate.');
        }

        if (elements.length > FILE_ELEMENTS_LIMIT) {
            throw new Error(
                `Too many elements. Maximum allowed: ${FILE_ELEMENTS_LIMIT}`
            );
        }

        const label = this.getItemContextLabel(options.projectCategory);
        const cql = format(IMPORT_RESOURCE_QUERY, label, label);

        const params = {
            projectId: options.projectId,
            projectStatus: ProjectStatusID.IN_PROGRESS,
            resourceName: options.fileName,
            resourceLanguage: options.language.code,
            resourceFormat: fileFormat.code,
            resourceStatus: StatusID.STARTED,
            resourceItemStatus: ItemStatusID.NEW,
            elements,
        };

        const records = await this.performDBRequest(cql, params);

        return records.map((record: any) => record.get('id'))[0];
    }

    public async createTranslation(
        resourceItemId: string,
        text: string,
        status: number,
        type: number,
        service?: number
    ): Promise<string> {
        this.validateTranslationStatusId(status);
        this.validateTranslationTypeId(type);

        if (service) {
            this.validateTranslationServiceId(service);
        }

        const params = {
            resourceItemId,
            text,
            status,
            type,
            service: service || null,
        };

        const records = await this.performDBRequest(
            CREATE_TRANSLATION_QUERY,
            params
        );

        const translationId = records.map((record: any) => record.get('id'))[0];
        if (!translationId) {
            throw new Error('Could not create translation.');
        }

        return translationId;
    }

    public async updateTranslation(
        id: string,
        status: number
    ): Promise<boolean> {
        this.validateTranslationStatusId(status);

        const params = {
            id,
            status,
            approvedStatus: TranslationStatusID.APPROVED,
            suggestedStatus: TranslationStatusID.SUGGESTED,
        };

        const records = await this.performDBRequest(
            UPDATE_TRANSLATION_QUERY,
            params
        );

        return !!records.map((record: any) => record.get('result') || false)[0];
    }

    public async deleteTranslation(id: string): Promise<boolean> {
        const records = await this.performDBRequest(DELETE_TRANSLATION_QUERY, {
            id,
        });

        return !!records.map((record: any) => record.get('result') || false)[0];
    }

    public async getApprovedTranslations(resourceId: string): Promise<any[]> {
        const params = {
            resourceId,
            approvedStatus: TranslationStatusID.APPROVED,
        };

        const records = await this.performDBRequest(
            GET_APPROVED_TRANSLATIONS,
            params
        );

        return records.map((record: any) => record.get('translation'));
    }

    public async export(
        resourceId: string,
        fileFormatCode: string,
        _abc: ABCId
    ): Promise<string> {
        const records = await this.performDBRequest(GET_RESOURCE_QUERY, {
            resourceId,
        });

        const resource = records.map((record: any) =>
            record.get('resource')
        )[0];

        if (!resource) {
            throw new Error('Resource not found');
        }

        const projectCategory = determine.category(resource.projectLabels);
        const projectSubCategory = determine.subCategory(
            resource.projectLabels
        );
        const contextLabel = this.getItemContextLabel(projectCategory);

        const fileFormat = this.getFileFormatByCode(
            fileFormatCode,
            projectCategory,
            projectSubCategory
        );

        const resourceStatus = resource.resource.status;
        if (resourceStatus === StatusID.STARTED) {
            const translations = await this.getApprovedTranslations(resourceId);
            if (!translations.length) {
                throw new Error('No translated items found.');
            }

            const elements: IElement[] = translations.map(
                (translation: any) => {
                    return this.translationToElement(translation, contextLabel);
                }
            );

            return fileFormat.parser().format(elements);
        }

        if (resourceStatus === StatusID.FINISHED) {
            // get from S3 bucket

            return '';
        }

        throw new Error('Resource status is not applicable for export.');
    }

    private async performDBRequest(
        cql: string,
        args: object
    ): Promise<Record[]> {
        return request.perform(
            cql,
            args,
            this.context.driver,
            this.context.logger
        );
    }

    private getItemContextLabel(projectCategory: Category): ItemContextLabel {
        return ITEM_CONTEXT_LABELS[projectCategory];
    }

    private translationToElement(
        _translation: any,
        contextLabel: ItemContextLabel
    ): IElement {
        const element: IElement = {
            text: '',
            context:
                contextLabel === ItemContextLabel.SUBTITLE
                    ? { timing: { startsAt: 0, endsAt: 1 } }
                    : { key: '' },
        };

        return element;
    }
}

export { Resource };
