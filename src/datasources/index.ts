import { Language } from './Language';
import { IMDB } from './IMDB';
import { Subtitles } from './Project/Category/Subtitles';
import { Offline } from './Project/Category/Subtitles/Offline';
import { Abc } from './Abc';
import { Spelling } from './Spelling';
import { DataSources } from './types';
import { Resource } from './Resource';
import { Project } from './Project';

const getDataSources = (): DataSources => {
    return {
        language: new Language(),
        imdb: new IMDB(),
        offlineSubtitlesProject: new Project(new Subtitles(new Offline())),
        abc: new Abc(),
        spelling: new Spelling(),
        resource: new Resource(),
    };
};

export { getDataSources, Language, IMDB, Project, Abc, Spelling, Resource };
