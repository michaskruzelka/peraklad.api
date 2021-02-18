import { DataSources } from '../../datasources/types';
import { SearchResponse, FileInfoResult } from './Category/Subtitles/types';
import { FileFormatCode } from '../Resource/types';
import { SearchParams } from './Category/types';
import {
    AccessTypeListResponse,
    AccessTypeResponse,
    Category,
    IMDBSubtitlesArgs,
    SubtitlesSubCategory,
} from './types';
import { ValidationError } from 'apollo-server';

const resolver = {
    Query: {
        projectAccessTypes: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): AccessTypeListResponse => {
            const accessTypes = dataSources.offlineSubtitlesProject.getAccessTypes();
            const defaultAccessType = dataSources.offlineSubtitlesProject.getDefaultAccessType();

            return accessTypes.map((accessType) => {
                return {
                    ...accessType,
                    isDefault: accessType.id === defaultAccessType.id,
                };
            });
        },
        defaultProjectAccessType: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): AccessTypeResponse => {
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
};

export { resolver };
