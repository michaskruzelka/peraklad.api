import OS from 'opensubtitles-api';
import got from 'got';
import { ungzip } from 'node-gzip';
import path from 'path';

import {
    Service,
    SearchParams,
    ServicesCodes,
    ServicesNames,
    ServiceSearchResult,
} from './types';
import {
    OPENSUBTITLES_UA,
    OPENSUBTITLES_USERNAME,
    OPENSUBTITLES_PASSWORD,
} from './config';

const service: Service = {
    code: ServicesCodes.OS,
    name: ServicesNames.OS,
    downloadDomains: ['dl.opensubtitles.org'],
    search: async (
        searchParams: SearchParams,
        limit: number
    ): Promise<ServiceSearchResult> => {
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
            sublanguageid: searchParams.languages
                .map((language) => language.iso639_2)
                .join(','),
            imdbid: searchParams.imdbId,
            season: searchParams.season ? String(searchParams.season) : null,
            episode: searchParams.episode ? String(searchParams.episode) : null,
            limit: String(limit),
            gzip: true,
        };

        return await client.search(input);
    },
    download: async (fileUrl: string): Promise<Buffer> => {
        let buffer;

        try {
            const response = await got(fileUrl);
            buffer = response.rawBody;
        } catch (e) {
            throw new Error(`Could not download the file: ${fileUrl}`);
        }

        const ext = path.extname(fileUrl).substr(1);
        if ('gz' === ext) {
            buffer = await ungzip(buffer);

        }

        return buffer || Buffer.from('');
    },
};

export default service;
