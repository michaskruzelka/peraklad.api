import { ValidationError } from 'apollo-server-lambda';

import RequiredFieldError from '../../services/errors/RequiredSelectionFieldError';
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
    IMovie,
    ISeries,
    IVideoInfo,
    CreateIMDBMovieProjectArgs,
    UpdateIMDBMovieProjectArgs,
    StatusID,
    UpdateProjectSettingsArgs,
    IMDBMovieArgs,
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
    if (!project.level.id) {
        throw new RequiredFieldError('level { id }');
    }

    return dataSources.movieSubtitlesProject.getLevelById(project.level.id);
};

const getLanguage = (
    object: { language: { code?: string } },
    dataSources: DataSources
) => {
    if (!object.language.code) {
        throw new RequiredFieldError('language { code }');
    }

    return dataSources.language.get(object.language.code);
};

const isSubtitlesResponseValid = (
    response: FileInfoResult,
    dataSources: DataSources
): boolean => {
    const fileFormats = dataSources.resource.getFileFormats(
        Category.SUBTITLES,
        SubCategory.MOVIE
    );

    return (
        fileFormats
            .map((fileFormat) => fileFormat.code)
            .includes(response.format as FileFormatCode) &&
        dataSources.language.isValidCodes([response.language])
    );
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
            { dataSources, logger }: { dataSources: DataSources; logger: any }
        ): Promise<SearchResponse> => {
            if (!dataSources.language.isValidCodes(args.languages)) {
                throw new ValidationError('Languages are not valid.');
            }

            const searchParams: SearchParams = {
                languages: args.languages.map((language: string) =>
                    dataSources.language.get(language)
                ),
                imdbId: dataSources.omdb.validateImdbId(args.imdbId, false),
                season: args.season || undefined,
                episode: args.episode || undefined,
            };

            try {
                return dataSources.movieSubtitlesProject.category.subCategory.searchForFiles(
                    searchParams,
                    args.limit || undefined,
                    args.service
                );
            } catch (e) {
                logger.log(
                    'info',
                    'Error while searching for project files: ' + e.message
                );
                throw new Error('Error while searching for project files.');
            }
        },
        projectStatuses: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): Status[] => {
            return dataSources.movieSubtitlesProject.getStatuses();
        },
    },
    Mutation: {
        CreateIMDBMovieProject: async (
            _: any,
            args: CreateIMDBMovieProjectArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<string> => {
            dataSources.language.validateCode(args.imdb.language);

            if (args.imdb.imdbId) {
                dataSources.omdb.validateImdbId(args.imdb.imdbId);
            }

            return dataSources.movieSubtitlesProject.createIMDBMovieProject(
                args
            );
        },
        UpdateIMDBMovieProject: async (
            _: any,
            args: UpdateIMDBMovieProjectArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<boolean> => {
            if (!(args.imdb || args.project)) {
                throw new ValidationError('Nothing to update.');
            }

            const imdb = args.imdb as IMDBMovieArgs;
            if (imdb?.language) {
                dataSources.language.validateCode(imdb.language);
            }

            const params = {
                id: args.id,
                project: args.project || {},
                imdb: imdb || {},
            };

            return dataSources.movieSubtitlesProject.updateIMDBMovieProject(
                params
            );
        },
        UpdateProjectSettings: async (
            _: any,
            args: UpdateProjectSettingsArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<boolean> => {
            if (args.settings.access) {
                dataSources.movieSubtitlesProject.validateAccessTypeId(
                    args.settings.access
                );
            }

            if (args.settings.abc) {
                dataSources.abc.validateId(args.settings.abc);
            }

            if (args.settings.spelling) {
                dataSources.spelling.validateId(args.settings.spelling);
            }

            return dataSources.movieSubtitlesProject.updateProjectSettings(
                args
            );
        },
        FailProject: async (
            _: any,
            args: { id: string },
            { dataSources }: { dataSources: DataSources }
        ): Promise<boolean> => {
            const params = {
                id: args.id,
                settings: { status: StatusID.FAILED },
            };

            return dataSources.movieSubtitlesProject.updateProjectSettings(
                params
            );
        },
        ResumeProject: async (
            _: any,
            args: { id: string },
            { dataSources }: { dataSources: DataSources }
        ): Promise<boolean> => {
            const params = {
                id: args.id,
                settings: { status: StatusID.IN_PROGRESS },
            };

            return dataSources.movieSubtitlesProject.updateProjectSettings(
                params
            );
        },
        DeleteProject: async (
            _: any,
            args: { id: string },
            { dataSources }: { dataSources: DataSources }
        ): Promise<boolean> => {
            return dataSources.movieSubtitlesProject.deleteProject(args.id);
        },
    },
    ImdbSubtitlesResponse: {
        filesInfo: (
            imdbSubtitles: SearchResponse,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ) => {
            const fileFormats = dataSources.resource.getFileFormats(
                Category.SUBTITLES,
                SubCategory.MOVIE
            );

            return imdbSubtitles.filesInfo
                .filter((fileInfo: FileInfoResult) =>
                    isSubtitlesResponseValid(fileInfo, dataSources)
                )
                .map((fileInfo: FileInfoResult) => ({
                    ...fileInfo,
                    format: fileFormats.find(
                        (fileFormat) => fileFormat.code === fileInfo.format
                    ),
                    language: dataSources.language.get(fileInfo.language),
                }));
        },
    },
    ImdbSubtitlesFile: {
        encoding: (fileInfo: any) => {
            return fileInfo.encoding || null;
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
        category: () => Category.SUBTITLES,
        subCategory: () => SubCategory.MOVIE,
    },
    VideoStreamSubtitles: {
        level: (
            project: IProject,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): Level => {
            return getLevel(project, dataSources);
        },
        category: () => Category.SUBTITLES,
        subCategory: () => SubCategory.VIDEO_STREAM,
    },
    ProjectSettings: {
        access: (
            projectSettings: ProjectSettings,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): AccessType => {
            if (!projectSettings.access.id) {
                throw new RequiredFieldError('access { id }');
            }

            return dataSources.movieSubtitlesProject.getAccessTypeById(
                projectSettings.access.id
            );
        },
        abc: (
            projectSettings: ProjectSettings,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): IABC => {
            if (!projectSettings.abc.id) {
                throw new RequiredFieldError('abc { id }');
            }

            return dataSources.abc.getABCById(projectSettings.abc.id);
        },
        spelling: (
            projectSettings: ProjectSettings,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): Spelling => {
            if (!projectSettings.spelling.id) {
                throw new RequiredFieldError('spelling { id }');
            }

            return dataSources.spelling.getById(projectSettings.spelling.id);
        },
        status: (
            projectSettings: ProjectSettings,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): Status => {
            if (!projectSettings.status.id) {
                throw new RequiredFieldError('status { id }');
            }

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
    Movie: {
        language: (
            movie: IMovie,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ) => {
            return getLanguage(movie, dataSources);
        },
    },
    Series: {
        language: (
            series: ISeries,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ) => {
            return getLanguage(series, dataSources);
        },
    },
    VideoInfo: {
        language: (
            videoInfo: IVideoInfo,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ) => {
            return getLanguage(videoInfo, dataSources);
        },
        service: (
            videoInfo: IVideoInfo,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ) => {
            if (!videoInfo.service.id) {
                throw new RequiredFieldError('service { id }');
            }

            return dataSources.videoStreamSubtitlesProject.category.subCategory.getServiceById(
                videoInfo.service.id
            );
        },
    },
};

export { resolver };
