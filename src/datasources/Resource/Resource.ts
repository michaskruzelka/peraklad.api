import { DataSource } from 'apollo-datasource';

import { Category, SubtitlesSubcategory } from 'datasources/Project/types';
import { FileFormat, IDataSource, SubtitlesFileFormats } from './types';
import { FILE_FORMATS } from './config';

class Resource extends DataSource implements IDataSource {
    public getFileFormats(
        category: Category,
        subCategory?: SubtitlesSubcategory | null
    ): FileFormat[] {
        const categoryFileFormats = FILE_FORMATS[category];
        if (!subCategory) {
            if (Array.isArray(categoryFileFormats)) {
                return categoryFileFormats as FileFormat[];
            }
            throw new Error('Subtitles subcategory not provided.');
        }

        return (categoryFileFormats as SubtitlesFileFormats)[subCategory] || [];
    }
}

export { Resource };
