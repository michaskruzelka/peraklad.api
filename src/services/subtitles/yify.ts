import cheerio from 'cheerio';
import got from 'got';
import AdmZip from 'adm-zip';

import langMap from './yifyLangMap.json';
import {
    Service,
    SearchParams,
    ServicesCodes,
    ServicesNames,
    ServiceSearchResult,
} from './types';
import { YIFY_SEARCH_URL } from './config';

const retrieveLanguage = ($el: cheerio.Cheerio): string => {
    const languageMap: any = langMap;
    const language = $el.find('.flag-cell .sub-lang').text() || '';

    return languageMap[language.toLowerCase()] || '';
};

const retrieveUri = ($el: cheerio.Cheerio): string => {
    const hrefAttr = $el.find('.download-cell a').attr('href');

    return hrefAttr ? hrefAttr.replace('subtitles/', 'subtitle/') + '.zip' : '';
};

const retrieveFileName = ($el: cheerio.Cheerio): string => {
    return $el
        .find('.text-muted')
        .parent()
        .text()
        .slice(9)
        .replace('subtitle ', '')
        .trim();
};

const retrieveRating = ($el: cheerio.Cheerio): number => {
    return Number($el.find('.rating-cell').text());
};

const service: Service = {
    code: ServicesCodes.YIFY,
    name: ServicesNames.YIFY,
    downloadDomains: ['yifysubtitles.org'],
    search: async (
        searchParams: SearchParams,
        limit: number
    ): Promise<ServiceSearchResult> => {
        const response = await got(
            `${YIFY_SEARCH_URL}/movie-imdb/tt${searchParams.imdbId}`
        );

        const $ = cheerio.load(response.body);
        let subtitles = $('tbody tr')
            .map((_, el) => {
                const $el = $(el);
                const uri = retrieveUri($el);

                return {
                    langcode: retrieveLanguage($el),
                    url: uri
                        ? `https://${service.downloadDomains[0]}/${uri}`
                        : '',
                    filename: retrieveFileName($el),
                    rating: retrieveRating($el),
                };
            })
            .get();

        subtitles = subtitles.filter((subtitle) => {
            return subtitle.url && subtitle.langcode && subtitle.filename;
        });
        subtitles.sort((a, b) => b.rating - a.rating);

        const result: ServiceSearchResult = {};

        const languageCodesThatMatter = searchParams.languages.map(
            (language) => language.code
        );

        for (const i in subtitles) {
            const lang = subtitles[i].langcode;
            if (!languageCodesThatMatter.includes(lang)) {
                continue;
            }
            if (!result[lang]) {
                result[lang] = [];
            }
            if (limit > result[lang].length) {
                result[lang].push(subtitles[i]);
            }
        }

        return result;
    },
    download: async (fileUrl: string): Promise<Buffer> => {
        let buffer;

        try {
            const response = await got(fileUrl);
            buffer = response.rawBody;
        } catch (e) {
            throw new Error(`Could not download the file: ${fileUrl}`);
        }

        const zip = new AdmZip(buffer);
        
        return zip.getEntries().shift()?.getData() || Buffer.from('');
    },
};

export default service;
