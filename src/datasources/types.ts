import { Language } from './Language';
import { IMDB } from './IMDB';
import { Project } from './Project';
import { Abc } from './Abc';
import { Spelling } from './Spelling';
import { Resource } from './Resource';

type DataSources = {
    language: Language;
    imdb: IMDB;
    movieSubtitlesProject: Project;
    abc: Abc;
    spelling: Spelling;
    resource: Resource;
};

export { DataSources };
