import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';

import {
    APIParams,
    APIResponse,
    APIError,
    ResponseType,
    IMovie,
    IDataSource,
    MovieType,
} from './types';
import { OMDB_API_KEY, OMDB_API_HOSTNAME, MOVIE_TYPES } from './config';
import { Language } from 'datasources';

class Movie extends RESTDataSource implements IDataSource {
    private imdbIdPattern = /^(tt)\d{7}$/;
    protected languageDataSource: Language;

    constructor(languageDataSource: Language) {
        super();

        if (!OMDB_API_KEY) {
            throw new Error('Movie search api key is not provided.');
        }

        if (!OMDB_API_HOSTNAME) {
            throw new Error('Movie search api hostname is not provided');
        }

        this.baseURL = OMDB_API_HOSTNAME;
        this.languageDataSource = languageDataSource;
    }

    /**
     * Sets apiKey parameter before sending a request
     *
     * @param request
     */
    public willSendRequest(request: RequestOptions) {
        request.params.set('apikey', OMDB_API_KEY);
        request.params.set('r', 'json');
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
     */
    public async searchByImdbId(imdbId: string | number): Promise<IMovie> {
        imdbId = String(imdbId);
        if (imdbId.indexOf('tt') !== 0) {
            imdbId = 'tt' + imdbId;
        }

        if (!this.imdbIdPattern.test(imdbId)) {
            throw new Error('Specified Imdb ID is not valid');
        }

        return await this.search({ i: imdbId });
    }

    /**
     * Searches for movie by title and year
     *
     * @param title the title of movie to search for
     * @param year the year when the movie was released
     */
    public async searchByTitleAndYear(
        title: string,
        year: number | undefined = undefined
    ): Promise<IMovie> {
        return await this.search({ t: title, y: year });
    }

    /**
     * Creates empty movie object with only language, type and imdbID filled
     *
     * @param imdbId
     * @returns empty object
     */
    public createEmptyObject(
        imdbId: string | number,
        movieType: MovieType = MovieType.MOVIE
    ): IMovie {
        return {
            title: '',
            year: null,
            type: movieType,
            language: this.languageDataSource.getDefaultLanguage().code,
            posterSrc: '',
            imdbRating: null,
            imdbId: this.asEmpty(String(imdbId)),
        };
    }

    /**
     * Searches for a Movie
     *
     * @param params search args
     */
    private async search(params: APIParams): Promise<IMovie> {
        let response = (await this.get('', params)) as APIResponse | APIError;

        if (response.Response === ResponseType.FALSE) {
            response = response as APIError;
            throw new Error(
                response.Error || 'Could not perform Movie Search API request.'
            );
        }

        response = response as APIResponse;

        if (!MOVIE_TYPES.includes(response.Type)) {
            throw new Error('Not a movie.');
        }

        return this.castAPIResponse(response);
    }

    /**
     * Casts the response come from api to the appropriate format
     */
    private castAPIResponse(apiResponse: APIResponse): IMovie {
        return {
            title: this.asEmpty(apiResponse.Title),
            year: this.asNumber(apiResponse.Year) || null,
            type: apiResponse.Type,
            language: this.toLanguageCode(apiResponse.Language),
            posterSrc: this.asEmpty(apiResponse.Poster),
            imdbRating: this.asNumber(apiResponse.imdbRating) || null,
            imdbId: apiResponse.imdbID,
            seriesId:
                MovieType.EPISODE === apiResponse.Type
                    ? apiResponse.seriesID
                    : undefined,
        };
    }

    /**
     * Casts the english language name to language code
     *
     * @param languageName the english name of language
     */
    private toLanguageCode(languageName: string): string {
        let languageCode;

        try {
            languageCode = this.languageDataSource.getByName(languageName).code;
        } catch {
            languageCode = this.languageDataSource.getDefaultLanguage().code;
        }

        return languageCode;
    }

    /**
     * Casts the value to number
     *
     * @param value value
     */
    private asNumber(value: string): number {
        return parseFloat(value.replace(',', '.'));
    }

    /**
     * Casts the value to empty string if 'N/A'
     * @param value value
     */
    private asEmpty(value: string): string {
        return 'N/A' === value ? '' : value;
    }
}

export { Movie };
