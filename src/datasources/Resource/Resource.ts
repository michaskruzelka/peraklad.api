import { DataSource, DataSourceConfig } from 'apollo-datasource';
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
import { IMPORT_RESOURCE_QUERY } from './queries';

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

    public getTranslationTypeById(id: number): TranslationType {
        const translationType = TRANSLATION_TYPES.find(
            (type) => type.id === id
        );

        if (!translationType) {
            throw new Error('Translation type not found.');
        }

        return translationType;
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

        const elements = await fileFormat.parser().parse(contents.contents);
        if (!elements) {
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
}

export { Resource };
