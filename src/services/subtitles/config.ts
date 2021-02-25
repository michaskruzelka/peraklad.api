import { StreamServiceId, StreamServiceCode, StreamService } from './types';

const OPENSUBTITLES_UA: string =
    process.env.OPENSUBTITLES_UA || 'TemporaryUserAgent';
const OPENSUBTITLES_USERNAME: string = process.env.OPENSUBTITLES_USERNAME || '';
const OPENSUBTITLES_PASSWORD: string = process.env.OPENSUBTITLES_PASSWORD || '';

const YIFY_SEARCH_URL = 'https://yts-subs.com';
const YIFY_DOWNLOAD_URL = 'https://yifysubtitles.org';

const STREAM_SERVICES: StreamService[] = [
    {
        id: StreamServiceId.YOUTUBE,
        code: StreamServiceCode.YOUTUBE,
    },
];

export {
    OPENSUBTITLES_UA,
    OPENSUBTITLES_USERNAME,
    OPENSUBTITLES_PASSWORD,
    STREAM_SERVICES,
    YIFY_SEARCH_URL,
    YIFY_DOWNLOAD_URL,
};
