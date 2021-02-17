import { ICategory, ISubCategory, SearchParams } from './types';

class Subtitles implements ICategory {
    private subCategory: ISubCategory;

    constructor(subCategory: ISubCategory) {
        this.subCategory = subCategory;
    }

    public getSubCategory(): ISubCategory {
        return this.subCategory;
    }

    public async searchForFiles(searchParams: SearchParams): Promise<any> {
        return this.subCategory.searchForFiles(searchParams);
    }
}

export { Subtitles };
