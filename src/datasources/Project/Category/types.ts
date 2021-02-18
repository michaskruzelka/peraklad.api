import { OfflineSearchParams } from './Subtitles/types';

interface ICategory {
    getSubCategory: () => ISubCategory;
    searchForFiles: (
        searchParams: SearchParams,
        limit?: number
    ) => Promise<any>;
}

type SearchParams = OfflineSearchParams;

interface ISubCategory {
    searchForFiles: (
        searchParams: SearchParams,
        limit?: number
    ) => Promise<any>;
}

export { ICategory, ISubCategory, SearchParams };
