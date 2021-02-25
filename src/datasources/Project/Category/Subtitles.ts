import { ICategory, ISubCategory } from './types';

class Subtitles implements ICategory {
    public readonly subCategory: ISubCategory;

    constructor(subCategory: ISubCategory) {
        this.subCategory = subCategory;
    }
}

export { Subtitles };
