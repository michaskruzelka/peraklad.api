import { Language } from './Language';
import { Movie } from './Movie';
import { DataSources } from './types';

const getDataSources = (): DataSources => {
    const language = new Language();

    return {
        language,
        movie: new Movie(language)
    };
};

export { getDataSources, Language, Movie };
