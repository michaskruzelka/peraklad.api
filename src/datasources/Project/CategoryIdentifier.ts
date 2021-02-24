import { Category } from './types';

class CategoryIdentifier {
    public static getCategoryByLabels(labels: string[]): Category {
        throw new Error('Unknown project category.');
    }
}

export { CategoryIdentifier };
