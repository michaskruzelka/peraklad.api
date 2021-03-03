import { DataSource } from 'apollo-datasource';
import { ValidationError } from 'apollo-server-lambda';

import { IDataSource, IABC } from './types';
import { Locale } from '../Language/types';
import { ABC_LIST, DEFAULT_ABC, CYRILLIC_ABC } from './config';

class ABC extends DataSource implements IDataSource {
    private locale: Locale;

    constructor(locale: Locale) {
        super();

        this.locale = locale;
    }
    
    /**
     * Gets all abcs
     *
     * @param locale Locale object
     *
     * @returns abc list
     */
    public getABCs(): IABC[] {
        return ABC_LIST[this.locale] || [];
    }

    public getCurrentABC(): IABC {
        // Take from token, validate, get default if not valid
        return this.getDefaultABC();
    }

    /**
     * Gets default abc
     *
     * @returns default abc
     */
    public getDefaultABC(): IABC {
        return DEFAULT_ABC[this.locale] || CYRILLIC_ABC;
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
        const abc = ABC_LIST[this.locale].find((abc) => abc.id === id);

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
