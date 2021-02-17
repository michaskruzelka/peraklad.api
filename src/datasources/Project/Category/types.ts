import { OfflineSearchParams } from './Subtitles/types';

interface ICategory {
    getSubCategory: () => ISubCategory;
    searchForFiles: (searchParams: any) => Promise<any>;
}

type SearchParams = OfflineSearchParams;

interface ISubCategory {
    searchForFiles: (searchParams: SearchParams) => Promise<any>;
}

export { ICategory, ISubCategory, SearchParams };
