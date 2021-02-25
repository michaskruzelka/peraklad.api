import cheerio from 'cheerio';
import got from 'got';

import { Service, SearchParams, ServicesCodes, ServicesNames } from './types';
import { YIFY_SEARCH_URL, YIFY_DOWNLOAD_URL } from './config';

const rearrange = (subtitles: any, limit: number) => {
    const result: any = {};
    subtitles.sort(
        (a: { rating: number }, b: { rating: number }) => b.rating - a.rating
    );

    for (const i in subtitles) {
        const lang = subtitles[i].language;
        if (!result[lang]) {
            result[lang] = [];
        }
        if (limit > result[lang].length) {
            result[lang].push(subtitles[i]);
        }
    }

    return result;
};

const service: Service = {
    code: ServicesCodes.YIFY,
    name: ServicesNames.YIFY,
    search: async (searchParams: SearchParams, limit: number) => {
        const response = await got(
            `${YIFY_SEARCH_URL}/movie-imdb/tt${searchParams.imdbId}`
        );

        const $ = cheerio.load(response.body);
        let subtitles: any = $('tbody tr')
            .map((_, el) => {
                const $el = $(el);
                const language = $el.find('.flag-cell .sub-lang').text() || '';
                const hrefAttr = $el.find('.download-cell a').attr('href');
                const url = hrefAttr
                    ? YIFY_DOWNLOAD_URL +
                      hrefAttr.replace('subtitles/', 'subtitle/') +
                      '.zip'
                    : '';

                return {
                    rating: Number($el.find('.rating-cell').text()),
                    filename: $el
                        .find('.text-muted')
                        .parent()
                        .text()
                        .slice(9)
                        .trim(),
                    language,
                    url,
                };
            })
            .get();

        subtitles = subtitles.filter((subtitle: any) => {
            return subtitle.url && subtitle.language && subtitle.filename;
        });

        return rearrange(subtitles, limit);
    },
};

export default service;
