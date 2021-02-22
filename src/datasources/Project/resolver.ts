import { DataSources } from '../../datasources/types';
import { SearchResponse, FileInfoResult } from './Category/Subtitles/types';
import { FileFormatCode } from '../Resource/types';
import { SearchParams } from './Category/types';
import {
    AccessType,
    ResolvedAccessType,
    Category,
    IMDBSubtitlesArgs,
    SubtitlesSubCategory,
    Project,
} from './types';
import { ValidationError } from 'apollo-server';

const isAccessTypeDefault = (
    accessType: ResolvedAccessType,
    dataSources: DataSources
): boolean => {
    if (accessType.isDefault !== undefined) {
        return accessType.isDefault;
    }

    return (
        dataSources.offlineSubtitlesProject.getDefaultAccessType().id ===
        accessType.id
    );
};

const resolver = {
    Query: {
        projectAccessTypes: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): AccessType[] => {
            return dataSources.offlineSubtitlesProject.getAccessTypes();
        },
        defaultProjectAccessType: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): ResolvedAccessType => {
            const defaultAccessType = dataSources.offlineSubtitlesProject.getDefaultAccessType();

            return { ...defaultAccessType, isDefault: true };
        },
        imdbSubtitles: async (
            _: any,
            args: IMDBSubtitlesArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<SearchResponse> => {
            if (!dataSources.language.isValidCodes(args.languages)) {
                throw new ValidationError('Languages are not valid.');
            }

            const searchParams: SearchParams = {
                languages: args.languages.map((language: string) =>
                    dataSources.language.get(language)
                ),
                imdbId: dataSources.imdb.validateImdbId(args.imdbId, false),
                season: args.season || undefined,
                episode: args.episode || undefined,
            };

            const result = await dataSources.offlineSubtitlesProject.searchForFiles(
                searchParams,
                args.limit || undefined
            );

            const fileFormats = dataSources.resource.getFileFormats(
                Category.SUBTITLES,
                SubtitlesSubCategory.OFFLINE
            );

            return {
                ...result,
                filesInfo: result.filesInfo
                    .filter(
                        (fileInfo: FileInfoResult) =>
                            fileFormats
                                .map((fileFormat) => fileFormat.code)
                                .includes(fileInfo.format as FileFormatCode) &&
                            dataSources.language.isValidCodes([
                                fileInfo.language,
                            ])
                    )
                    .map((fileInfo: FileInfoResult) => ({
                        ...fileInfo,
                        format: fileFormats.find(
                            (fileFormat) => fileFormat.code === fileInfo.format
                        ),
                        language: dataSources.language.get(fileInfo.language),
                    })),
            };
        },
    },
    MovieSubtitles: {
        accessType: (
            project: Project,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ) => {
            return dataSources.offlineSubtitlesProject.getAccessTypeById(
                project.type
            );
        },
    },
    ProjectAccessType: {
        isDefault: (
            accessType: ResolvedAccessType,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): boolean => {
            return isAccessTypeDefault(accessType, dataSources);
        },
    },
};

export { resolver };
