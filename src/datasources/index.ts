import { Language } from './Language';
import { IMDB } from './IMDB';
import { Subtitles } from './Project/Category/Subtitles';
import { Movie } from './Project/Category/Subtitles/Movie';
import { ABC } from './ABC';
import { Spelling } from './Spelling';
import { DataSources } from './types';
import { Resource } from './Resource';
import { Project } from './Project';

const getDataSources = (): DataSources => {
    return {
        language: new Language(),
        imdb: new IMDB(),
        movieSubtitlesProject: new Project(new Subtitles(new Movie())),
        abc: new ABC(),
        spelling: new Spelling(),
        resource: new Resource(),
    };
};

export { getDataSources };
