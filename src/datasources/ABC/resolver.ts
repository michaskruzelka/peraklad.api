import { DataSources } from '../types';
import { IABC, IResolvedABC } from './types';

const resolver = {
    Query: {
        abcs: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): IABC[] => {
            return dataSources.abc.getABCs();
        },
        defaultAbc: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): IResolvedABC => {
            const defaultAbc = dataSources.abc.getDefaultABC();

            return { ...defaultAbc, isDefault: true };
        },
    },
    ABC: {
        isDefault: (
            abc: IResolvedABC,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): boolean => {
            if (undefined !== abc.isDefault) {
                return abc.isDefault;
            }

            return abc.id === dataSources.abc.getDefaultABC().id;
        },
    },
};

export { resolver };
