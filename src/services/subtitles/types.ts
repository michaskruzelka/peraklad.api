import { MovieSubtitlesSearchParams } from '../../datasources/Project/Category/Subtitles/types';

type SearchParams = MovieSubtitlesSearchParams;

enum ServicesCodes {
    OS = 'opensubtitles',
}

enum ServicesNames {
    OS = 'OpenSubtitles',
}

enum StreamServiceId {
    YOUTUBE = 1,
}

enum StreamServiceCode {
    YOUTUBE = 'youtube',
}

type StreamService = {
    id: StreamServiceId;
    code: StreamServiceCode;
};

type Service = {
    code: ServicesCodes;
    name: ServicesNames;
    search: (searchParams: SearchParams, limit: number) => any;
};

export {
    SearchParams,
    ServicesCodes,
    ServicesNames,
    Service,
    StreamServiceId,
    StreamServiceCode,
    StreamService,
};
