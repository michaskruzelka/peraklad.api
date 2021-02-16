import { Language } from './Language';
import { IMDB } from './IMDB';
import { Project } from './Project';
import { Abc } from './Abc';
import { Spelling } from './Spelling';

type DataSources = {
    language: Language;
    imdb: IMDB;
    project: Project;
    abc: Abc;
    spelling: Spelling;
};

export { DataSources };
