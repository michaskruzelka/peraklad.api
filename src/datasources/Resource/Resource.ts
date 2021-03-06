import { DataSource } from 'apollo-datasource';

import { getFileContents } from '../../services/file';
import { Category, SubCategory } from 'datasources/Project/types';
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
} from './types';
import {
    FILE_FORMATS,
    ITEM_STATUSES,
    STATUSES,
    TRANSLATION_STATUSES,
    TRANSLATION_TYPES,
    TRANSLATION_SERVICES,
} from './config';

class Resource extends DataSource implements IDataSource {
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

    public async import(buffer: Buffer, options: ImportOptions) {
        // 1) decode buffer to string
        // 2) determine and validate file format
        // 3) call file format parser and get js list
        // 4) create resource node
        // 5) create resourceItem nodes

        // --- 1 --- //
        const contents = getFileContents(buffer, options.encoding);
        const extension = contents.extension || options.extension;
        if (!extension) {
            throw new Error('Could not recognize file format.');
        }

        // --- 2 --- //
        const fileFormat = this.getFileFormatByExtension(
            extension,
            options.projectCategory,
            options.projectSubCategory
        );

        // --- 3 --- //
        const elements = await fileFormat.parser().parse(contents.contents);

        console.log(elements);

        return elements;
    }

    // public readLocalFile(file: string) {

    // }
}

export { Resource };
