import { Language } from './Language';
import { DataSources } from './types';

const getDataSources = (): DataSources => ({
    language: new Language(),
});

export { getDataSources, Language };
