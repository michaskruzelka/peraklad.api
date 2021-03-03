import { DataSource } from 'apollo-datasource';
import { ValidationError } from 'apollo-server-lambda';

import { IDataSource, Spelling as TypeSpelling } from './types';
import { Locale } from '../Language/types';
import { SPELLINGS, DEFAULT_SPELLING, ACADEMIC_SPELLING } from './config';

class Spelling extends DataSource implements IDataSource {
    private locale: Locale;

    constructor(locale: Locale) {
        super();

        this.locale = locale;
    }

    /**
     * Gets all spellings
     *
     * @returns all spellings
     */
    public getSpellings(): TypeSpelling[] {
        return SPELLINGS[this.locale];
    }

    public getCurrentSpelling(): TypeSpelling {
        // Take from token, validate, get default if not valid
        return this.getDefaultSpelling();
    }

    /**
     * Gets default spelling
     *
     * @returns default spelling
     */
    public getDefaultSpelling(): TypeSpelling {
        return DEFAULT_SPELLING[this.locale] || ACADEMIC_SPELLING;
    }

    /**
     * Gets spelling by ID
     *
     * @param id spelling ID
     *
     * @returns spelling object
     *
     * @throws an error when spelling was not found
     */
    public getById(id: number): TypeSpelling {
        const spelling = SPELLINGS[this.locale].find(
            (spelling) => spelling.id === id
        );

        if (!spelling) {
            throw new Error('Spelling not found');
        }

        return spelling;
    }

    public validateId(id: number): void {
        try {
            this.getById(id);
        } catch (e) {
            throw new ValidationError('Spelling ID is not valid.');
        }
    }
}

export { Spelling };
