import { DataSource } from 'apollo-datasource';

import { IDataSource, Spelling as TypeSpelling } from './types';
import { SPELLINGS, DEFAULT_SPELLING } from './config';

class Spelling extends DataSource implements IDataSource {
    /**
     * Gets all spellings
     *
     * @returns all spellings
     */
    public getSpellings(): TypeSpelling[] {
        return SPELLINGS;
    }

    /**
     * Gets default spelling
     *
     * @returns default spelling
     */
    public getDefaultSpelling(): TypeSpelling {
        return (
            SPELLINGS.find((spelling) => spelling.id === DEFAULT_SPELLING) ||
            SPELLINGS[0]
        );
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
        const spelling = SPELLINGS.find((spelling) => spelling.id === id);

        if (!spelling) {
            throw new Error('Spelling not found');
        }

        return spelling;
    }
}

export { Spelling };
