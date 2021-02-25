import { ICategory, ISubCategory, SearchParams } from './types';

class Subtitles implements ICategory {
    public readonly subCategory: ISubCategory;

    constructor(subCategory: ISubCategory) {
        this.subCategory = subCategory;
    }

    public async searchForFiles(
        searchParams: SearchParams,
        limit?: number
    ): Promise<any> {
        return this.subCategory.searchForFiles(searchParams, limit);
    }
}

export { Subtitles };
