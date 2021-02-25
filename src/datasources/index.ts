import { Language } from './Language';
import { OMDB } from './OMDB';
import { Subtitles } from './Project/Category/Subtitles';
import { Movie } from './Project/Category/Subtitles/Movie';
import { VideoStream } from './Project/Category/Subtitles/VideoStream';
import { ABC } from './ABC';
import { Spelling } from './Spelling';
import { DataSources } from './types';
import { Resource } from './Resource';
import { Project } from './Project';

const getDataSources = (): DataSources => {
    return {
        language: new Language(),
        omdb: new OMDB(),
        movieSubtitlesProject: new Project(new Subtitles(new Movie())),
        videoStreamSubtitlesProject: new Project(
            new Subtitles(new VideoStream())
        ),
        abc: new ABC(),
        spelling: new Spelling(),
        resource: new Resource(),
    };
};

export { getDataSources };
