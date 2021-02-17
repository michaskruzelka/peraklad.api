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

enum IMDBType {
    MOVIE = 'movie',
    SERIES = 'series',
    EPISODE = 'episode',
}

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

interface APIIMDB extends APIResponse {
    Type: IMDBType;
    Title: string;
    Year: string;
    imdbID: string;
    Poster: string;
    Language: string;
    imdbRating: string;
    Plot?: string;
}

interface IIMDB extends APIIMDB {
    imdbId: string;
    type: IMDBType;
    title: string;
    posterSrc: string;
    plot?: string;
}

interface IMovie extends IIMDB {
    type: IMDBType.MOVIE;
    language: string;
    year: number;
}

interface IEpisode extends IIMDB {
    seriesID: string;
    Episode: string;
    Season: string;
    type: IMDBType.EPISODE;
    series: ISeries;
    seasonNum: number;
    episodeNum: number;
    year: number;
}

interface ISeries extends IIMDB {
    type: IMDBType.SERIES;
    language: string;
    totalSeasons: string;
    episodes: IEpisode[];
}

interface IDataSource {
    searchByImdbId: (imdbId: string | number) => Promise<IIMDB>;
    searchByTitleAndYear: (
        title: string,
        year: number | undefined
    ) => Promise<IIMDB>;
    searchForEpisodes: (
        imdbId: string | number,
        seasonNum: number,
        episodeNum: number
    ) => Promise<IIMDB[]>;
    searchForEpisode: (
        imdbId: string | number,
        seasonNum: number,
        episodeNum: number
    ) => Promise<IIMDB>;
    createEmptyBaseMovieObject: () => IIMDB;
    validateImdbId(imdbId: string | number): string;
}

export {
    APIParams,
    APIByIdPlushSeason,
    APIResponse,
    APIEpisodes,
    APIError,
    APIIMDB,
    IMDBType,
    ResponseType,
    IMovie,
    IEpisode,
    ISeries,
    IIMDB,
    IDataSource,
    SearchByIdArgs,
    SearchByTitlePlusYearArgs,
    EpisodesArgs,
};
