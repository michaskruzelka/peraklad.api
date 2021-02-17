import OS from 'opensubtitles-api';
import { ValidationError } from 'apollo-server';

import { ISubCategory } from '../types';
import { OfflineSearchParams } from './types';
import {
    OPENSUBTITLES_UA,
    OPENSUBTITLES_USERNAME,
    OPENSUBTITLES_PASSWORD,
} from './config';

class Offline implements ISubCategory {
    public async searchForFiles(
        searchParams: OfflineSearchParams
    ): Promise<any> {
        if (!(searchParams.imdbId || searchParams.title)) {
            throw new ValidationError('ImdbId or Title not specified.');
        }

        const osClient = this.getOSClient();
        const results = await osClient.search(searchParams);

        console.log(results);

        // return results.map((result) => {});
    }

    private getOSClient(): OS {
        if (
            !(
                OPENSUBTITLES_UA &&
                OPENSUBTITLES_USERNAME &&
                OPENSUBTITLES_PASSWORD
            )
        ) {
            throw new Error('Opensubtitles credentials not fully set.');
        }

        return new OS({
            useragent: OPENSUBTITLES_UA,
            username: OPENSUBTITLES_USERNAME,
            password: OPENSUBTITLES_PASSWORD,
            ssl: true,
        });
    }
}

export { Offline };
