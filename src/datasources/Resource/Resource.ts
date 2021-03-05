import { DataSource } from 'apollo-datasource';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';

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

    public import(buffer: Buffer, options: any) {
        // 1) decode buffer
        // 2) determine and validate file format
        // 3) call file format parser and get js list
        // 4) create resource node
        // 5) create resourceItem nodes
        
        const charset = (
            jschardet.detect(buffer, { minimumThreshold: 0.5 }).encoding ||
            options.encoding ||
            'UTF-8'
        ).toUpperCase();

        const contents = iconv.decode(buffer, charset);
        


        console.log(contents);
    }

    // public readLocalFile(file: string) {

    // }
}

export { Resource };
