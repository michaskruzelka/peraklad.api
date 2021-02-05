import { Language } from './Language';
import { Movie } from './Movie';
import { DataSources } from './types';

const getDataSources = (): DataSources => {
    return {
        language: new Language(),
        movie: new Movie(),
    };
};

export { getDataSources, Language, Movie };
