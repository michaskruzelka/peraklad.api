import { Language } from './Language';
import { OMDB } from './OMDB';
import { Project } from './Project';
import { ABC } from './ABC';
import { Spelling } from './Spelling';
import { Resource } from './Resource';
import { Intl } from './Intl';

type DataSources = {
    language: Language;
    omdb: OMDB;
    movieSubtitlesProject: Project;
    videoStreamSubtitlesProject: Project;
    abc: ABC;
    spelling: Spelling;
    resource: Resource;
    intl: Intl;
};

export { DataSources };
