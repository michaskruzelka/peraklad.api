import { DataSource } from 'apollo-datasource';

import { IDataSource, ABC } from './types';
import { ABC_LIST, DEFAULT_ABC } from './config';

class Abc extends DataSource implements IDataSource {
    /**
     * Gets all abcs
     *
     * @returns abc list
     */
    public getABCs(): ABC[] {
        return ABC_LIST;
    }

    /**
     * Gets default abc
     *
     * @returns default abc
     */
    public getDefaultABC(): ABC {
        return ABC_LIST.find((abc) => abc.id === DEFAULT_ABC) || ABC_LIST[0];
    }
}

export { Abc };
