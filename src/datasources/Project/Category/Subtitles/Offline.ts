import OS from 'opensubtitles-api';
import { ValidationError } from 'apollo-server';

import { ISubCategory } from '../types';
import {
    OfflineSearchParams,
    SearchServicesCodes,
    SearchService,
    SearchResult,
} from './types';
import {
    OPENSUBTITLES_UA,
    OPENSUBTITLES_USERNAME,
    OPENSUBTITLES_PASSWORD,
} from './config';

const searchService: SearchService = {
    code: SearchServicesCodes.OS,
    execute: async (searchParams: OfflineSearchParams) => {
        if (
            !(
                OPENSUBTITLES_UA &&
                OPENSUBTITLES_USERNAME &&
                OPENSUBTITLES_PASSWORD
            )
        ) {
            throw new Error('Opensubtitles credentials not fully set.');
        }

        const client = new OS({
            useragent: OPENSUBTITLES_UA,
            username: OPENSUBTITLES_USERNAME,
            password: OPENSUBTITLES_PASSWORD,
            ssl: true,
        });

        const input = {
            sublanguageid: searchParams.language.iso639_2,
            imdbid: searchParams.imdbId,
            query: searchParams.title,
            limit: '5',
            gzip: true,
        };

        return await client.search(input);
    },
};

class Offline implements ISubCategory {
    public async searchForFiles(
        searchParams: OfflineSearchParams
    ): Promise<SearchResult> {
        if (!(searchParams.imdbId || searchParams.title)) {
            throw new ValidationError('ImdbId or Title not specified.');
        }

        const result = await searchService.execute(searchParams);
        
        return {
            service: searchService.code,
            filesInfo: (result[searchParams.language.code] || []).map(
                (fileInfo: any) => ({
                    url: fileInfo.url,
                    fileName: fileInfo.filename,
                    format: String(fileInfo.format).toLowerCase(),
                    language: searchParams.language,
                    encoding: fileInfo.encoding,
                })
            ),
        };
    }
}

export { Offline };
