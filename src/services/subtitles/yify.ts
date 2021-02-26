import cheerio from 'cheerio';
import got from 'got';

import langMap from './yifyLangMap.json';
import {
    Service,
    SearchParams,
    ServicesCodes,
    ServicesNames,
    ServiceSearchResult,
} from './types';
import { YIFY_SEARCH_URL, YIFY_DOWNLOAD_URL } from './config';

const retrieveLanguage = ($el: cheerio.Cheerio): string => {
    const languageMap: any = langMap;
    const language = $el.find('.flag-cell .sub-lang').text() || '';

    return languageMap[language.toLowerCase()] || '';
};

const retrieveUrl = ($el: cheerio.Cheerio): string => {
    const hrefAttr = $el.find('.download-cell a').attr('href');

    return hrefAttr
        ? YIFY_DOWNLOAD_URL +
              hrefAttr.replace('subtitles/', 'subtitle/') +
              '.zip'
        : '';
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

                return {
                    langcode: retrieveLanguage($el),
                    url: retrieveUrl($el),
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
};

export default service;
