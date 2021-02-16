import { Language } from './Language';
import { IMDB } from './IMDB';
import { Project } from './Project';
import { Abc } from './Abc';
import { Spelling } from './Spelling';
import { DataSources } from './types';
import { Resource } from './Resource';

const getDataSources = (): DataSources => {
    return {
        language: new Language(),
        imdb: new IMDB(),
        project: new Project(),
        abc: new Abc(),
        spelling: new Spelling(),
        resource: new Resource(),
    };
};

export { getDataSources, Language, IMDB, Project, Abc, Spelling, Resource };
