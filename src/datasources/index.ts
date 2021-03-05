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
import { Intl } from './Intl';
import { Converter } from '../services/lacinka/Converter';

const getDataSources = async () => {
    const latinConverter = await Converter.getInstance();
    const language = new Language();
    const spelling = new Spelling(language.getCurrentLocale());
    const abc = new ABC(language.getCurrentLocale());

    return (): DataSources => ({
        language,
        abc,
        spelling,
        omdb: new OMDB(),
        movieSubtitlesProject: new Project(new Subtitles(new Movie())),
        videoStreamSubtitlesProject: new Project(
            new Subtitles(new VideoStream())
        ),
        resource: new Resource(),
        intl: new Intl(
            language.getCurrentLocale(),
            spelling,
            abc,
            latinConverter
        ),
    });
};

export { getDataSources };
