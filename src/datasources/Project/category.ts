import { CATEGORIES, SUBCATEGORIES } from './config';
import { Category, SubCategory } from './types';

const determine = {
    category: (labels: string[]): Category => {
        const category = CATEGORIES.find((category) =>
            category.labels.filter((label) => labels.includes(label))
        );

        if (!category) {
            throw new Error(
                'Unknown project labels. Could not determine the category.'
            );
        }

        return category.code;
    },
    subCategory: (labels: string[]): SubCategory | undefined => {
        const subCategory = SUBCATEGORIES.find((subCategory) =>
            subCategory.labels.filter((label) => labels.includes(label))
        );

        return subCategory ? subCategory.code : undefined;
    },
};

export { determine };
