import { DataSource } from 'apollo-datasource';

import { IDataSource, AccessType } from './types';
import { ACCESS_TYPES, DEFAULT_ACCESS_TYPE } from './config';

class Project extends DataSource implements IDataSource {
    /**
     * Gets all access types
     *
     * @returns access type list
     */
    public getAccessTypes(): AccessType[] {
        return ACCESS_TYPES;
    }

    /**
     * Gets default access type
     *
     * @returns default access type
     */
    public getDefaultAccessType(): AccessType {
        return (
            ACCESS_TYPES.find(
                (accessType) => accessType.id === DEFAULT_ACCESS_TYPE
            ) || ACCESS_TYPES[0]
        );
    }
}

export { Project };
