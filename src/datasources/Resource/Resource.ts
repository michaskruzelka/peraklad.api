import { DataSource } from 'apollo-datasource';

import { Category, SubtitlesSubCategory } from 'datasources/Project/types';
import { FileFormat, IDataSource, SubtitlesFileFormats } from './types';
import { FILE_FORMATS } from './config';

class Resource extends DataSource implements IDataSource {
    public getFileFormats(
        category: Category,
        subCategory?: SubtitlesSubCategory | null
    ): FileFormat[] {
        const categoryFileFormats = FILE_FORMATS[category];
        if (!subCategory) {
            if (Array.isArray(categoryFileFormats)) {
                return categoryFileFormats as FileFormat[];
            }
            throw new Error('Subtitles subCategory not provided.');
        }

        return (categoryFileFormats as SubtitlesFileFormats)[subCategory] || [];
    }
}

export { Resource };
