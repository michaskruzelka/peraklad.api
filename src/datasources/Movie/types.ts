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

type MovieType = 'movie' | 'series' | 'episode';

enum ResponseType {
	TRUE = 'True',
	FALSE = 'False',
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
}

interface IMovie {
	imdbId?: string | null;
	title: string;
	year: number;
	imdbRating?: number | null;
	posterSrc?: string | null;
	language: string;
	type: string;
}

export {
	APIParams,
	APIResponse,
	APIError,
	MovieType,
	ResponseType,
	IMovie,
	SearchByIdArgs,
	SearchByTitlePlusYearArgs,
};
