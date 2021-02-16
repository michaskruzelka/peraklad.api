import { Language } from './Language';
import { Movie } from './Movie';
import { Project } from './Project';
import { Abc } from './Abc';
import { Spelling } from './Spelling';
import { DataSources } from './types';

const getDataSources = (): DataSources => {
    return {
        language: new Language(),
        movie: new Movie(),
        project: new Project(),
        abc: new Abc(),
        spelling: new Spelling(),
    };
};

export { getDataSources, Language, Movie, Project, Abc, Spelling };
