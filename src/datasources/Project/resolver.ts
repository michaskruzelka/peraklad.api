import { ValidationError } from 'apollo-server';

import { DataSources } from '../types';
import { SearchResponse, FileInfoResult } from './Category/Subtitles/types';
import { FileFormatCode } from '../Resource/types';
import { SearchParams } from './Category/types';
import {
    AccessType,
    ResolvedAccessType,
    Category,
    IMDBSubtitlesArgs,
    SubCategory,
    IProject,
    Level,
    ProjectSettings,
    Status,
} from './types';
import { IABC } from '../ABC/types';
import { Spelling } from '../Spelling/types';

const isAccessTypeDefault = (
    accessType: ResolvedAccessType,
    dataSources: DataSources
): boolean => {
    if (accessType.isDefault !== undefined) {
        return accessType.isDefault;
    }

    return (
        dataSources.movieSubtitlesProject.getDefaultAccessType().id ===
        accessType.id
    );
};

const getLevel = (project: IProject, dataSources: DataSources): Level => {
    return dataSources.movieSubtitlesProject.getLevelById(project.level.id);
};

const resolver = {
    Query: {
        projectAccessTypes: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): AccessType[] => {
            return dataSources.movieSubtitlesProject.getAccessTypes();
        },
        defaultProjectAccessType: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): ResolvedAccessType => {
            const defaultAccessType = dataSources.movieSubtitlesProject.getDefaultAccessType();

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

            const result = await dataSources.movieSubtitlesProject.searchForFiles(
                searchParams,
                args.limit || undefined
            );

            const fileFormats = dataSources.resource.getFileFormats(
                Category.SUBTITLES,
                SubCategory.OFFLINE
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
        level: (
            project: IProject,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): Level => {
            return getLevel(project, dataSources);
        },
    },
    ProjectSettings: {
        access: (
            projectSettings: ProjectSettings,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): AccessType => {
            return dataSources.movieSubtitlesProject.getAccessTypeById(
                projectSettings.access.id
            );
        },
        abc: (
            projectSettings: ProjectSettings,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): IABC => {
            return dataSources.abc.getABCById(projectSettings.abc.id);
        },
        spelling: (
            projectSettings: ProjectSettings,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): Spelling => {
            return dataSources.spelling.getById(projectSettings.spelling.id);
        },
        status: (
            projectSettings: ProjectSettings,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): Status => {
            return dataSources.movieSubtitlesProject.getStatusById(
                projectSettings.status.id
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
