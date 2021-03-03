import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { ValidationError } from 'apollo-server-lambda';

import { IDataSource, IABC } from './types';
import { Locale } from '../Language/types';
import { ABC_LIST, DEFAULT_ABC, CYRILLIC_ABC } from './config';
import { IContext } from '../../services/graphql/types';

class ABC extends DataSource implements IDataSource {
    private locale: Locale;
    private context: IContext;

    constructor(locale: Locale) {
        super();

        this.locale = locale;
    }

    initialize(config: DataSourceConfig<IContext>): void {
        this.context = config.context;
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
        const abcId = this.context.abc;

        if (abcId) {
            try {
                return this.getABCById(abcId);
            } catch (e) {
                this.context.logger.log(
                    'info',
                    `Could not get current ABC by id: ${abcId}`
                );
            }
        }

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
