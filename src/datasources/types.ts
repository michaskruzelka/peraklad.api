import { Language } from './Language';
import { IMDB } from './IMDB';
import { Project } from './Project';
import { ABC } from './ABC';
import { Spelling } from './Spelling';
import { Resource } from './Resource';

type DataSources = {
    language: Language;
    imdb: IMDB;
    movieSubtitlesProject: Project;
    abc: ABC;
    spelling: Spelling;
    resource: Resource;
};

export { DataSources };
