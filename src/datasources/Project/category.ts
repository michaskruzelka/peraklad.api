import { DataSources } from '../types';
import { CATEGORIES, SUBCATEGORIES } from './config';
import { Category, SubCategory, IDataSource } from './types';

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
    dataSource: (labels: string[], dataSources: DataSources): IDataSource => {
        let dataSource: IDataSource;

        const category = determine.category(labels);
        const subCategory = determine.subCategory(labels);

        switch (category) {
            case Category.SUBTITLES: {
                dataSource =
                    subCategory === SubCategory.MOVIE
                        ? dataSources.movieSubtitlesProject
                        : dataSources.videoStreamSubtitlesProject;
                break;
            }
            case Category.SOFTWARE: {
                dataSource = dataSources.project;
                // dataSources = dataSources.softwareProject
                break;
            }
            default: {
                dataSource = dataSources.project;
            }
        }

        return dataSource;
    },
};

export { determine };
