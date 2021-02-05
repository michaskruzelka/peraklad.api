import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';

import {
    APIParams,
    APIByIdPlushSeason,
    APIResponse,
    APIEpisodes,
    APIMovie,
    APIError,
    ResponseType,
    IDataSource,
    IBaseMovie,
    MovieType,
} from './types';
import { OMDB_API_KEY, OMDB_API_HOSTNAME, MOVIE_TYPES } from './config';

class Movie extends RESTDataSource implements IDataSource {
    private imdbIdPattern = /^(tt)\d{7}$/;

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
    public async searchByImdbId(imdbId: string | number): Promise<IBaseMovie> {
        imdbId = this.validateImdbId(imdbId);

        return await this.searchForMovie({ i: imdbId });
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
    ): Promise<IBaseMovie> {
        return await this.searchForMovie({ t: title, y: year });
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
    ): Promise<IBaseMovie[]> {
        imdbId = this.validateImdbId(imdbId);
        let result: IBaseMovie[] = [];

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
    ): Promise<IBaseMovie> {
        imdbId = this.validateImdbId(imdbId);
        return await this.searchForMovie({
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
    public createEmptyBaseMovieObject(): IBaseMovie {
        return {
            Response: ResponseType.TRUE,
            Type: MovieType.MOVIE,
            Title: '',
            Year: '',
            imdbID: '',
            Poster: '',
            Language: '',
            imdbRating: '',
            imdbId: '',
            type: MovieType.MOVIE,
            title: '',
            posterSrc: '',
        };
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
    ): Promise<IBaseMovie[]> {
        let episodes: IBaseMovie[] = [];
        const params: APIByIdPlushSeason = {
            i: imdbId,
            Season: seasonNum,
        };

        try {
            const response = (await this.performRequest(params)) as APIEpisodes;
            episodes = await Promise.all(
                response.Episodes.map(async (episodeInfo) => {
                    const params = { i: episodeInfo.imdbID };
                    return await this.searchForMovie(params);
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
     *
     * @returns the validated imdb ID
     *
     * @throws an error when imdb ID is not valid
     */
    private validateImdbId(imdbId: string | number): string {
        imdbId = String(imdbId);
        if (imdbId.indexOf('tt') !== 0) {
            imdbId = 'tt' + imdbId;
        }

        if (!this.imdbIdPattern.test(imdbId)) {
            throw new Error('Specified Imdb ID is not valid');
        }

        return imdbId;
    }

    /**
     * Searches for a Movie
     *
     * @param params search args
     *
     * @returns api response enriched with base movie properties
     *
     * @throws an error when movie type in response is unrecognized
     */
    private async searchForMovie(params: APIParams): Promise<IBaseMovie> {
        const response = (await this.performRequest(params)) as APIMovie;

        if (!MOVIE_TYPES.includes(response.Type)) {
            throw new Error('Not a movie.');
        }

        return this.enrichResponseWithBaseMovie(response);
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
                    'Could not perform Movie Search API request.'
            );
        }

        return response;
    }

    /**
     * Enriches api response with base movie properties
     *
     * @param response response come from api
     *
     * @returns api response enriched with base movie properties
     */
    private enrichResponseWithBaseMovie(response: APIMovie): IBaseMovie {
        return {
            ...response,
            imdbId: response.imdbID,
            type: response.Type,
            title: response.Title,
            posterSrc: this.asEmpty(response.Poster),
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

export { Movie };
