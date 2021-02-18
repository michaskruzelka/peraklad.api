import { RESTDataSource } from 'apollo-datasource-rest';

import { ICategory, SearchParams } from './Category/types';
import { IDataSource, AccessType } from './types';
import { ACCESS_TYPES, DEFAULT_ACCESS_TYPE } from './config';

class Project extends RESTDataSource implements IDataSource {
    private category: ICategory;

    constructor(category: ICategory) {
        super();

        this.category = category;
    }

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

    /**
     * Searches for files
     *
     * @param searchParams search parameters
     * @param limit search limit
     *
     * @returns files list
     */
    public async searchForFiles(
        searchParams: SearchParams,
        limit?: number
    ): Promise<any> {
        try {
            return this.category.searchForFiles(searchParams, limit);
        } catch (e) {
            this.context.logger.log(
                'info',
                'Error while searching for project files: ' + e.message
            );
        }
    }
}

export { Project };
