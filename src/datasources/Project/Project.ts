import { RESTDataSource } from 'apollo-datasource-rest';

import { ICategory, SearchParams } from './Category/types';
import { IDataSource, AccessType, Level, Status } from './types';
import { ACCESS_TYPES, DEFAULT_ACCESS_TYPE, LEVELS, STATUSES } from './config';

class Project extends RESTDataSource implements IDataSource {
    public readonly category: ICategory;

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
     * Gets access type by id
     *
     * @param id access type id
     *
     * @returns access type
     *
     * @throws an error when the access type was not found
     */
    public getAccessTypeById(id: number): AccessType {
        const accessType = ACCESS_TYPES.find(
            (accessType) => accessType.id === id
        );

        if (!accessType) {
            throw new Error('Project access type not found.');
        }

        return accessType;
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
     * Gets level by id
     *
     * @param id level id
     * @returns level
     */
    public getLevelById(id: number): Level {
        const level = LEVELS.find((level) => level.id === id);

        if (!level) {
            throw new Error('Project level not found.');
        }

        return level;
    }

    /**
     * Gets status by ID
     *
     * @param id status ID
     *
     * @returns status object
     *
     * @throws an error when status was not found
     */
    public getStatusById(id: number): Status {
        const status = STATUSES.find((status) => status.id === id);

        if (!status) {
            throw new Error('Project status not found');
        }

        return status;
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
