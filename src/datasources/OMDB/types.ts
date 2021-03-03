type APIByIdParams = {
    i: string;
};

type APIByTitlePlusYearParams = {
    t: string;
    y?: number;
};

type APIByIdPlushSeason = {
    i: string;
    Season: number;
};

type APIByIdPlushSeasonAndEpisode = {
    i: string;
    Season: number;
    Episode: number;
};

type APIParams =
    | APIByIdParams
    | APIByTitlePlusYearParams
    | APIByIdPlushSeason
    | APIByIdPlushSeasonAndEpisode;

type SearchByIdArgs = {
    imdbId: string;
};

type SearchByTitlePlusYearArgs = {
    title: string;
    year?: number;
};

type EpisodesArgs = {
    season?: number;
    episode?: number;
};

enum ResponseType {
    TRUE = 'True',
    FALSE = 'False',
}

enum OMDBTypeCode {
    MOVIE = 'movie',
    SERIES = 'series',
    EPISODE = 'episode',
}

type OMDBType = {
    code: OMDBTypeCode;
    name: string;
};

interface APIResponse {
    Response: ResponseType;
}

interface APIError extends APIResponse {
    Error: string;
}

interface APIEpisode {
    Title: string;
    Episode: string;
    imdbID: string;
}

interface APIEpisodes extends APIResponse {
    Episodes: APIEpisode[];
}

interface APIOMDB extends APIResponse {
    Type: OMDBTypeCode;
    Title: string;
    Year: string;
    imdbID: string;
    Poster: string;
    Language: string;
    imdbRating: string;
    Plot?: string;
}

interface IOMDB extends APIOMDB {
    imdbId: string;
    type?: OMDBType;
    title: string;
    posterSrc: string;
    plot?: string;
}

interface IMovie extends IOMDB {
    Type: OMDBTypeCode.MOVIE;
    language: string;
    year: number;
}

interface IEpisode extends IOMDB {
    seriesID: string;
    Episode: string;
    Season: string;
    Type: OMDBTypeCode.EPISODE;
    series: ISeries;
    seasonNum: number;
    episodeNum: number;
    year: number;
}

interface ISeries extends IOMDB {
    Type: OMDBTypeCode.SERIES;
    language: string;
    totalSeasons: string;
    episodes: IEpisode[];
}

interface IDataSource {
    searchByImdbId: (imdbId: string | number) => Promise<IOMDB>;
    searchByTitleAndYear: (
        title: string,
        year: number | undefined
    ) => Promise<IOMDB>;
    searchForEpisodes: (
        imdbId: string | number,
        seasonNum: number,
        episodeNum: number
    ) => Promise<IOMDB[]>;
    searchForEpisode: (
        imdbId: string | number,
        seasonNum: number,
        episodeNum: number
    ) => Promise<IOMDB>;
    createEmptyBaseMovieObject: () => IOMDB;
    validateImdbId(imdbId: string | number, withPrefix: boolean): string;
    getOMDBTypes: () => OMDBType[];
}

export {
    APIParams,
    APIByIdPlushSeason,
    APIResponse,
    APIEpisodes,
    APIError,
    APIOMDB,
    OMDBTypeCode,
    OMDBType,
    ResponseType,
    IMovie,
    IEpisode,
    ISeries,
    IOMDB,
    IDataSource,
    SearchByIdArgs,
    SearchByTitlePlusYearArgs,
    EpisodesArgs,
};
