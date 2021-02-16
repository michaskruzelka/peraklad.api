import { DataSources } from '../../datasources/types';
import { AccessTypeListResponse, AccessTypeResponse } from './types';

const resolver = {
    Query: {
        projectAccessTypes: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): AccessTypeListResponse => {
            const accessTypes = dataSources.project.getAccessTypes();
            const defaultAccessType = dataSources.project.getDefaultAccessType();
            
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
            const defaultAccessType = dataSources.project.getDefaultAccessType();
            
            return { ...defaultAccessType, isDefault: true };
        },
    },
};

export { resolver };
