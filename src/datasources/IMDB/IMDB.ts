import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';
import { ValidationError } from 'apollo-server';

import {
    APIParams,
    APIByIdPlushSeason,
    APIResponse,
    APIEpisodes,
    APIIMDB,
    APIError,
    ResponseType,
    IDataSource,
    IIMDB,
    IMDBType,
} from './types';

import { OMDB_API_KEY, OMDB_API_HOSTNAME, IMDB_TYPES } from './config';

class IMDB extends RESTDataSource implements IDataSource {
    private imdbIdPattern = /^(tt)?\d{7}$/;

    constructor() {
        super();

        if (!OMDB_API_KEY) {
            throw new Error('Movie search api key is not provided.');
        }

        if (!OMDB_API_HOSTNAME) {
            throw new Error('Movie search api hostname is not provided');
        }

        this.baseURL = OMDB_API_HOSTNAME;
    }

    /**
     * Sets apiKey parameter before sending a request
     *
     * @param request
     */
    public willSendRequest(request: RequestOptions) {
        request.params.set('apikey', OMDB_API_KEY);
        request.params.set('r', 'json');
        request.params.set('v', '1');
    }

    /**
     * @throws an error when called
     */
    public didEncounterError() {
        throw new Error('Could not perform Movie Search API request.');
    }

    /**
     * Searches for movie by imdb id
     *
     * @param imdbId the imdb id of a movie to search for
     *
     * @returns a base movie object found in omdb
     */
    public async searchByImdbId(imdbId: string | number): Promise<IIMDB> {
        imdbId = this.validateImdbId(imdbId);

        return await this.searchForIMDB({ i: imdbId });
    }

    /**
     * Searches for movie by title and year
     *
     * @param title the title of movie to search for
     * @param year the year when the movie was released
     *
     * @returns a base movie object found in omdb
     */
    public async searchByTitleAndYear(
        title: string,
        year: number | undefined = undefined
    ): Promise<IIMDB> {
        return await this.searchForIMDB({ t: title, y: year });
    }

    /**
     * Searches for episodes of the certain season
     *
     * @param imdbId imdb ID
     * @param seasonNum the number of season
     * @param episodeNum the number of episode
     *
     * @returns a list of base movie objects found in omdb
     */
    public async searchForEpisodes(
        imdbId: string | number,
        seasonNum: number,
        episodeNum: number = 0
    ): Promise<IIMDB[]> {
        imdbId = this.validateImdbId(imdbId);
        let result: IIMDB[] = [];

        if (episodeNum) {
            try {
                result.push(
                    await this.searchForEpisode(imdbId, seasonNum, episodeNum)
                );
            } catch (e) {
                this.context.logger.log(
                    'info',
                    'Could not find an episode with series imdbId = ' +
                        imdbId +
                        ': ' +
                        e.message
                );
            }
        } else {
            result = [
                ...result,
                ...(await this.getSeasonEpisodes(imdbId, seasonNum)),
            ];
        }

        return result;
    }

    /**
     * Searches for an episode in omdb
     *
     * @param imdbId imdb ID
     * @param seasonNum the number of season
     * @param episodeNum the number of episode
     *
     * @returns base movie object found in omdb
     */
    public async searchForEpisode(
        imdbId: string | number,
        seasonNum: number,
        episodeNum: number
    ): Promise<IIMDB> {
        imdbId = this.validateImdbId(imdbId);
        return await this.searchForIMDB({
            i: imdbId,
            Season: seasonNum,
            Episode: episodeNum,
        });
    }

    /**
     * Creates an empty base movie object
     *
     * @returns and empty base movie object with 'movie' type by default
     */
    public createEmptyBaseMovieObject(): IIMDB {
        return {
            Response: ResponseType.TRUE,
            Type: IMDBType.MOVIE,
            Title: '',
            Year: '',
            imdbID: '',
            Poster: '',
            Language: '',
            imdbRating: '',
            imdbId: '',
            type: IMDBType.MOVIE,
            title: '',
            posterSrc: '',
        };
    }

    /**
     * Gets all movie types
     *
     * @returns movie type list
     */
    public getIMDBTypes(): IMDBType[] {
        return IMDB_TYPES;
    }

    /**
     * Gets episodes from the certain season
     *
     * @param imdbId imdb ID
     * @param seasonNum season number
     *
     * @returns episodes list searched in api
     */
    private async getSeasonEpisodes(
        imdbId: string,
        seasonNum: number
    ): Promise<IIMDB[]> {
        let episodes: IIMDB[] = [];
        const params: APIByIdPlushSeason = {
            i: imdbId,
            Season: seasonNum,
        };

        try {
            const response = (await this.performRequest(params)) as APIEpisodes;
            episodes = await Promise.all(
                response.Episodes.map((episodeInfo) => {
                    const params = { i: episodeInfo.imdbID };
                    return this.searchForIMDB(params);
                })
            );
        } catch (e) {
            this.context.logger.log(
                'info',
                'Could not find episodes with series imdbId = ' +
                    imdbId +
                    ': ' +
                    e.message
            );
        }

        return episodes;
    }

    /**
     * Validates imdb ID prepending 'tt' prefix beforehand
     *
     * @param imdbId imdb ID
     * @param withPrefix to prepend 'tt' prefix to id
     *
     * @returns the validated imdb ID
     *
     * @throws an error when imdb ID is not valid
     */
    public validateImdbId(
        imdbId: string | number,
        withPrefix: boolean = true
    ): string {
        const prefix = 'tt';
        let validatedImdbId = String(imdbId);

        if (validatedImdbId.indexOf(prefix) !== 0) {
            if (withPrefix) {
                validatedImdbId = prefix + validatedImdbId;
            }
        } else {
            if (!withPrefix) {
                validatedImdbId = validatedImdbId.substring(prefix.length);
            }
        }

        if (!this.imdbIdPattern.test(validatedImdbId)) {
            throw new ValidationError('Specified Imdb ID is not valid');
        }

        return validatedImdbId;
    }

    /**
     * Searches for a Movie
     *
     * @param params search args
     *
     * @returns api response enriched with base IMDB properties
     *
     * @throws an error when IMDB type in response is unrecognized
     */
    private async searchForIMDB(params: APIParams): Promise<IIMDB> {
        const response = (await this.performRequest(params)) as APIIMDB;

        if (!IMDB_TYPES.includes(response.Type)) {
            throw new Error('Unrecognized IMDB type: ' + response.Type);
        }

        return this.enrichResponseWithBaseIMDBInfo(response);
    }

    /**
     * Performs an api request
     *
     * @param params api request params
     *
     * @returns api response
     *
     * @throws an error when Repsonse has 'False' value
     */
    private async performRequest(params: APIParams): Promise<APIResponse> {
        const response = (await this.get('', params)) as APIResponse;

        if (response.Response === ResponseType.FALSE) {
            throw new Error(
                (response as APIError).Error ||
                    'Could not perform IMDB Search API request.'
            );
        }

        return response;
    }

    /**
     * Enriches api response with base IMDB properties
     *
     * @param response response come from api
     *
     * @returns api response enriched with base IMDB properties
     */
    private enrichResponseWithBaseIMDBInfo(response: APIIMDB): IIMDB {
        return {
            ...response,
            imdbId: response.imdbID,
            type: response.Type,
            title: response.Title,
            posterSrc: this.asEmpty(response.Poster),
            plot: response.Plot ? this.asEmpty(response.Plot) : '',
        };
    }

    /**
     * Casts the value to float number
     *
     * @param value value
     *
     * @returns float value
     */
    public asFloat(value: string): number {
        return parseFloat(this.asEmpty(value).replace(',', '.'));
    }

    /**
     * Casts the value to integer
     *
     * @param value value
     *
     * @returns int value
     */
    public asInt(value: string): number {
        return parseInt(this.asEmpty(value).replace(',', '.'));
    }

    /**
     * Casts the value to empty string if 'N/A'
     *
     * @param value value
     *
     * @returns empty string value
     */
    public asEmpty(value: string): string {
        return 'N/A' === value ? '' : value;
    }
}

export { IMDB };
