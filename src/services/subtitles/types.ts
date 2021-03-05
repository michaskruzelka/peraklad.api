import { MovieSubtitlesSearchParams } from '../../datasources/Project/Category/Subtitles/types';

type SearchParams = MovieSubtitlesSearchParams;

enum ServicesCodes {
    OS = 'OPENSUBTITLES',
    YIFY = 'YIFY',
}

enum ServicesNames {
    OS = 'OpenSubtitles',
    YIFY = 'YIFY Subtitles',
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

type ServiceSearchResult = {
    [key: string]: {
        url: string;
        langcode: string;
        filename: string;
        format?: string;
        encoding?: string;
    }[];
};

type Service = {
    code: ServicesCodes;
    name: ServicesNames;
    downloadDomains: string[];
    search: (
        searchParams: SearchParams,
        limit: number
    ) => Promise<ServiceSearchResult>;
    download: (fileUrl: string) => Promise<Buffer>;
};

export {
    SearchParams,
    ServicesCodes,
    ServicesNames,
    Service,
    StreamServiceId,
    StreamServiceCode,
    StreamService,
    ServiceSearchResult,
};
