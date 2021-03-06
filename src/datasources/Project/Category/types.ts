import { ServicesCodes, Service } from '../../../services/subtitles/types';
import { MovieSubtitlesSearchParams } from './Subtitles/types';

interface ICategory {
    readonly subCategory: ISubCategory;
    readRemoteFile: (fileUrl: string) => any;
}

// It will be a union type in future
type SearchParams = MovieSubtitlesSearchParams;

interface ISubCategory {
    searchForFiles: (
        searchParams: SearchParams,
        limit?: number,
        serviceCode?: ServicesCodes | null
    ) => Promise<any>;
    getSubtitlesService: (filter: (service: Service) => boolean) => Service;
    getServiceById: (id: number) => any;
}

export { ICategory, ISubCategory, SearchParams };
