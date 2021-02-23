import { MovieSubtitlesSearchParams } from './Subtitles/types';

interface ICategory {
    getSubCategory: () => ISubCategory;
    searchForFiles: (
        searchParams: SearchParams,
        limit?: number
    ) => Promise<any>;
}

// It will be a union type in future
type SearchParams = MovieSubtitlesSearchParams;

interface ISubCategory {
    searchForFiles: (
        searchParams: SearchParams,
        limit?: number
    ) => Promise<any>;
}

export { ICategory, ISubCategory, SearchParams };
