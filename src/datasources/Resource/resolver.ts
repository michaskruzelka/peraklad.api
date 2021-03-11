import { ValidationError } from 'apollo-server';

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
    IRecommendation,
    ITiming,
    TimingFormat,
    FileFormatCode,
    ImportOptions,
    CreateResourceArgs,
} from './types';
import { ILanguage } from '../Language/types';
import { LOCALES } from '../Language/config';
import RequiredFieldError from '../../services/errors/RequiredSelectionFieldError';
import { determine } from '../Project/category';
import { LevelID } from '../Project/types';
import { IElement } from '../../services/parser/types';
import { promisifyBufferStream } from '../../services/parser/utils';
import { getFileExt, getFileNameWithNoExt } from '../../services/file';

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
        resourceItemStatuses: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ) => {
            return dataSources.resource.getItemStatuses();
        },
    },
    Mutation: {
        CreateResource: async (
            _: any,
            args: CreateResourceArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<string> => {
            dataSources.language.validateCode(args.language);
            if (!(args.file || args.fileUrl) || (args.file && args.fileUrl)) {
                throw new ValidationError(
                    'Please provide either file or fileUrl.'
                );
            }

            const project = await dataSources.project.getProjectById(
                args.projectId
            );

            if (project.project.type === LevelID.PARENT) {
                throw new Error(
                    'Cannot attach any resources to a project with parent level.'
                );
            }

            let buffer: Buffer;
            let extension: FileFormatCode;
            let fileName: string;

            if (args.fileUrl) {
                const projectDataSource = determine.dataSource(
                    project.labels,
                    dataSources
                );
                buffer = await projectDataSource.readRemoteFile(args.fileUrl);
                fileName = getFileNameWithNoExt(args.fileUrl);
                extension = getFileExt(args.fileUrl) as FileFormatCode;
            } else {
                const { createReadStream, filename } = await args.file!;
                buffer = await promisifyBufferStream(createReadStream());
                fileName = getFileNameWithNoExt(filename);
                extension = getFileExt(filename) as FileFormatCode;
            }

            if (!buffer.length) {
                throw new Error('Could not read the file.');
            }

            const importOptions: ImportOptions = {
                projectId: project.id,
                projectCategory: determine.category(project.labels),
                projectSubCategory: determine.subCategory(project.labels),
                fileName: fileName.trim().replace(/\s/g, '.'),
                language: dataSources.language.get(args.language),
                encoding: args.encoding,
                extension: extension,
            };

            return dataSources.resource.import(buffer, importOptions);
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
    Recommendation: {
        language: (
            recommendation: IRecommendation,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ) => {
            if (!recommendation.language.code) {
                throw new RequiredFieldError('language { code }');
            }

            return dataSources.language.get(recommendation.language.code);
        },
    },
    FileFormat: {
        description: (fileFormat: FileFormat): string | null => {
            return fileFormat.description || null;
        },
    },
    Timing: {
        formatted: (
            timing: ITiming,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): TimingFormat[] => {
            const formattedSettings = timing.formatted[0];

            if (!formattedSettings.text) {
                throw new RequiredFieldError('timing { formatted { text } }');
            }

            return dataSources.resource
                .getFileFormats(
                    determine.category(formattedSettings.text.labels),
                    determine.subCategory(formattedSettings.text.labels)
                )
                .map((fileFormat: FileFormat) => {
                    return {
                        fileFormat: fileFormat,
                        text: formattedSettings.text,
                    };
                });
        },
    },
    TimingFormat: {
        text: (
            timingFormat: TimingFormat,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): string => {
            const element: IElement = {
                text: '',
                context: {
                    timing: {
                        startsAt: timingFormat.text.startsAt.total,
                        endsAt: timingFormat.text.endsAt.total,
                    },
                },
            };

            const locale = dataSources.language.getCurrentLocale();
            const language = dataSources.language.get(locale);
            const options = {
                langName: language.name,
                langCode: LOCALES[locale],
            };

            return timingFormat.fileFormat
                .parser()
                .formatElementTemplate(element, options);
        },
    },
};

export { resolver };
