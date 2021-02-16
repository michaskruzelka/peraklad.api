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

enum MovieType {
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

interface APIMovie extends APIResponse {
    Type: MovieType;
    Title: string;
    Year: string;
    imdbID: string;
    Poster: string;
    Language: string;
    imdbRating: string;
    Plot?: string;
}

interface IBaseMovie extends APIMovie {
    imdbId: string;
    type: MovieType;
    title: string;
    posterSrc: string;
    plot?: string;
}

interface IMovie extends IBaseMovie {
    type: MovieType.MOVIE;
    language: string;
    year: number;
}

interface IEpisode extends IBaseMovie {
    seriesID: string;
    Episode: string;
    Season: string;
    type: MovieType.EPISODE;
    series: ISeries;
    seasonNum: number;
    episodeNum: number;
    year: number;
}

interface ISeries extends IBaseMovie {
    type: MovieType.SERIES;
    language: string;
    totalSeasons: string;
    episodes: IEpisode[];
}

interface IDataSource {
    searchByImdbId: (imdbId: string | number) => Promise<APIResponse>;
    searchByTitleAndYear: (
        title: string,
        year: number | undefined
    ) => Promise<APIResponse>;
}

export {
    APIParams,
    APIByIdPlushSeason,
    APIResponse,
    APIEpisodes,
    APIError,
    APIMovie,
    MovieType,
    ResponseType,
    IMovie,
    IEpisode,
    ISeries,
    IBaseMovie,
    IDataSource,
    SearchByIdArgs,
    SearchByTitlePlusYearArgs,
    EpisodesArgs,
};
