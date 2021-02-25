import { Language } from './Language';
import { OMDB } from './OMDB';
import { Project } from './Project';
import { ABC } from './ABC';
import { Spelling } from './Spelling';
import { Resource } from './Resource';

type DataSources = {
    language: Language;
    omdb: OMDB;
    movieSubtitlesProject: Project;
    videoStreamSubtitlesProject: Project;
    abc: ABC;
    spelling: Spelling;
    resource: Resource;
};

export { DataSources };
