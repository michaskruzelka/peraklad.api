import { DataSources } from '../../datasources/types';
import { SpellingResponse, SpellingListResponse } from './types';

const resolver = {
    Query: {
        spellings: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): SpellingListResponse => {
            const spellings = dataSources.spelling.getSpellings();
            const defaultSpelling = dataSources.spelling.getDefaultSpelling();

            return spellings.map((spelling) => {
                return {
                    ...spelling,
                    isDefault: spelling.id === defaultSpelling.id,
                };
            });
        },
        defaultSpelling: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): SpellingResponse => {
            const defaultSpelling = dataSources.spelling.getDefaultSpelling();

            return { ...defaultSpelling, isDefault: true };
        },
    },
};

export { resolver };
