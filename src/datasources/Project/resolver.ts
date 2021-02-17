import { DataSources } from '../../datasources/types';
import { SearchParams } from './Category/types';
import {
    AccessTypeListResponse,
    AccessTypeResponse,
    IMDBSubtitlesArgs,
} from './types';

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
        ) => {
            const searchParams: SearchParams = {
                language: dataSources.language.get(args.language),
                imdbId: args.imdbId
                    ? dataSources.imdb.validateImdbId(args.imdbId)
                    : null,
                title: args.title,
            };

            await dataSources.offlineSubtitlesProject.searchForFiles(
                searchParams
            );

            return 'test';
        },
    },
};

export { resolver };
