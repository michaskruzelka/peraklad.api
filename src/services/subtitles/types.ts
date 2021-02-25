import { MovieSubtitlesSearchParams } from '../../datasources/Project/Category/Subtitles/types';

type SearchParams = MovieSubtitlesSearchParams;

enum ServicesCodes {
    OS = 'OPENSUBTITLES',
    YIFY = 'YIFY',
}

enum ServicesNames {
    OS = 'OpenSubtitles',
    YIFY = 'YIFY Subtitles'
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
