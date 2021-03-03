import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { ValidationError } from 'apollo-server-lambda';

import { IDataSource, Spelling as TypeSpelling } from './types';
import { Locale } from '../Language/types';
import { SPELLINGS, DEFAULT_SPELLING, ACADEMIC_SPELLING } from './config';
import { IContext } from '../../services/graphql/types';

class Spelling extends DataSource implements IDataSource {
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
     * Gets all spellings
     *
     * @returns all spellings
     */
    public getSpellings(): TypeSpelling[] {
        return SPELLINGS[this.locale];
    }

    public getCurrentSpelling(): TypeSpelling {
        const spellingId = this.context.spelling;

        if (spellingId) {
            try {
                return this.getById(spellingId);
            } catch (e) {
                this.context.logger.log(
                    'info',
                    `Could not get current spelling by id: ${spellingId}`
                );
            }
        }

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
