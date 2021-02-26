import { DataSources } from '../types';
import {
    FileFormat,
    FileFormatsArgs,
    IResource,
    IResourceItem,
    ITranslation,
    Status,
    ItemStatus,
    TranslationStatus,
    TranslationType,
    TranslationService,
} from './types';
import { ILanguage } from '../Language/types';
import RequiredFieldError from '../../services/errors/RequiredSelectionFieldError';
import { determine } from '../Project/category';

const resolver = {
    Query: {
        fileFormats: (
            _: any,
            args: FileFormatsArgs,
            { dataSources }: { dataSources: DataSources }
        ): FileFormat[] => {
            return dataSources.resource.getFileFormats(
                args.category,
                args.subCategory
            );
        },
    },
    Resource: {
        format: (
            resource: IResource,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): FileFormat => {
            if (!resource.format.code) {
                throw new RequiredFieldError('format { code }');
            }

            return dataSources.resource.getFileFormatByCode(
                resource.format.code._code,
                determine.category(resource.format.code._labels),
                determine.subCategory(resource.format.code._labels)
            );
        },
        language: (
            resource: IResource,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): ILanguage => {
            if (!resource.language.code) {
                throw new RequiredFieldError('language { code }');
            }

            return dataSources.language.get(resource.language.code);
        },
        status: (
            resource: IResource,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): Status => {
            if (!resource.status.id) {
                throw new RequiredFieldError('status { id }');
            }

            return dataSources.resource.getStatusById(resource.status.id);
        },
    },
    ResourceItem: {
        status: (
            resourceItem: IResourceItem,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): ItemStatus => {
            if (!resourceItem.status.id) {
                throw new RequiredFieldError('status { id }');
            }

            return dataSources.resource.getItemStatusById(
                resourceItem.status.id
            );
        },
    },
    Translation: {
        status: (
            translation: ITranslation,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): TranslationStatus => {
            if (!translation.status.id) {
                throw new RequiredFieldError('status { id }');
            }

            return dataSources.resource.getTranslationStatusById(
                translation.status.id
            );
        },
        type: (
            translation: ITranslation,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): TranslationType => {
            if (!translation.type.id) {
                throw new RequiredFieldError('type { id }');
            }

            return dataSources.resource.getTranslationTypeById(
                translation.type.id
            );
        },
        service: (
            translation: ITranslation,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): TranslationService | null => {
            if (!translation.service || translation.service.id === null) {
                return null;
            }

            if (!translation.service.id) {
                throw new RequiredFieldError('service { id }');
            }

            return dataSources.resource.getTranslationServiceById(
                translation.service.id
            );
        },
    },
    FileFormat: {
        description: (fileFormat: FileFormat): string | null => {
            return fileFormat.description || null;
        },
    },
};

export { resolver };
