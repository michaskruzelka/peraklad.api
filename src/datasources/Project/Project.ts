import { DataSource } from 'apollo-datasource';

import { ICategory, SearchParams } from './Category/types';
import { IDataSource, AccessType } from './types';
import { ACCESS_TYPES, DEFAULT_ACCESS_TYPE } from './config';

class Project extends DataSource implements IDataSource {
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
     * Gets the category of the project
     *
     * @returns ICategory instance
     */
    public getCategory(): ICategory {
        return this.category;
    }

    /**
     * Searches for files
     *
     * @param searchParams search parameters
     * 
     * @returns files list
     */
    public async searchForFiles(searchParams: SearchParams): Promise<any> {
        return this.category.searchForFiles(searchParams);
    }
}

export { Project };
