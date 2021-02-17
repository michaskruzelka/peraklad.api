import { DataSources } from '../../datasources/types';
import { ABCListResponse, ABCResponse } from './types';

const resolver = {
    Query: {
        abcs: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): ABCListResponse => {
            const abcs = dataSources.abc.getABCs();
            const defaultAbc = dataSources.abc.getDefaultABC();
            
            return abcs.map((abc) => {
                return { ...abc, isDefault: abc.id === defaultAbc.id };
            });
        },
        defaultAbc: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): ABCResponse => {
            const defaultAbc = dataSources.abc.getDefaultABC();

            return { ...defaultAbc, isDefault: true };
        },
    },
};

export { resolver };
