import { DataSources } from '../types';
import { ResolvedSpelling, Spelling } from './types';

const resolver = {
    Query: {
        spellings: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): Spelling[] => {
            return dataSources.spelling.getSpellings();
        },
        defaultSpelling: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): ResolvedSpelling => {
            const defaultSpelling = dataSources.spelling.getDefaultSpelling();

            return { ...defaultSpelling, isDefault: true };
        },
    },
    Spelling: {
        isDefault: (
            spelling: ResolvedSpelling,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): boolean => {
            if (undefined !== spelling.isDefault) {
                return spelling.isDefault;
            }

            return dataSources.spelling.getDefaultSpelling().id === spelling.id;
        },
    },
};

export { resolver };
