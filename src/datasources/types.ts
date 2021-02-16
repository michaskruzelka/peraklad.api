import { Language } from './Language';
import { Movie } from './Movie';
import { Project } from './Project';
import { Abc } from './Abc';
import { Spelling } from './Spelling';

type DataSources = {
    language: Language;
    movie: Movie;
    project: Project;
    abc: Abc;
    spelling: Spelling;
};

export { DataSources };
