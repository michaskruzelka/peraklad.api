import { Language } from './Language';
import { IMDB } from './IMDB';
import { Project } from './Project';
import { Abc } from './Abc';
import { Spelling } from './Spelling';
import { DataSources } from './types';

const getDataSources = (): DataSources => {
    return {
        language: new Language(),
        imdb: new IMDB(),
        project: new Project(),
        abc: new Abc(),
        spelling: new Spelling(),
    };
};

export { getDataSources, Language, IMDB, Project, Abc, Spelling };
