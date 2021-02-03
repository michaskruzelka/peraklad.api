type APIByIdParams = {
    i: string;
};

type APIByTitlePlusYearParams = {
    t: string;
    y?: number;
};

type APIParams = APIByIdParams | APIByTitlePlusYearParams;

type SearchByIdArgs = {
    imdbId: string;
};

type SearchByTitlePlusYearArgs = {
    title: string;
    year?: number;
};

interface APIError {
    Response: ResponseType;
    Error: string;
}

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
    Title: string;
    Year: string;
    imdbID: string;
    Type: MovieType;
    Poster: string | 'N/A';
    Language: string;
    imdbRating: string;
    Response: ResponseType;
    seriesID: string;
}

interface IMovie {
    imdbId: string;
    title?: string;
    year?: number | null;
    imdbRating?: number | null;
    posterSrc?: string | null;
    language: string;
    type: MovieType;
    seriesId?: string;
}

interface IEpisode extends IMovie {
    series: IMovie;
    seriesId: string;
    type: MovieType.EPISODE;
}

interface IDataSource {
    searchByImdbId: (imdbId: string | number) => Promise<IMovie | IEpisode>;
    searchByTitleAndYear: (
        title: string,
        year: number | undefined
    ) => Promise<IMovie | IEpisode>;
}

export {
    APIParams,
    APIResponse,
    APIError,
    MovieType,
    ResponseType,
    IMovie,
    IEpisode,
    IDataSource,
    SearchByIdArgs,
    SearchByTitlePlusYearArgs,
};
