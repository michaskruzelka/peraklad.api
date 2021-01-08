import { Language } from './Language';
import { Movie } from './Movie';
import { DataSources } from './types';

const getDataSources = (): DataSources => ({
    language: new Language(),
    movie: new Movie(),
});

export { getDataSources, Language };
