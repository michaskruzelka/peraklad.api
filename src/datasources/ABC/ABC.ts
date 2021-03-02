import { DataSource } from 'apollo-datasource';
import { ValidationError } from 'apollo-server-lambda';

import { IDataSource, IABC } from './types';
import { ABC_LIST, DEFAULT_ABC } from './config';

class ABC extends DataSource implements IDataSource {
    /**
     * Gets all abcs
     *
     * @returns abc list
     */
    public getABCs(): IABC[] {
        return ABC_LIST;
    }

    /**
     * Gets default abc
     *
     * @returns default abc
     */
    public getDefaultABC(): IABC {
        return ABC_LIST.find((abc) => abc.id === DEFAULT_ABC) || ABC_LIST[0];
    }

    /**
     * Gets abc by id
     *
     * @param id abc id
     *
     * @returns abc object
     *
     * @throws an error when abc was not found
     */
    public getABCById(id: number): IABC {
        const abc = ABC_LIST.find((abc) => abc.id === id);

        if (!abc) {
            throw new Error('ABC not found.');
        }

        return abc;
    }

    public validateId(id: number): void {
        try {
            this.getABCById(id);
        } catch (e) {
            throw new ValidationError('ABC ID is not valid.');
        }
    }
}

export { ABC };
