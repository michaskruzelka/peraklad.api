import { ILanguage } from 'datasources/Language/types';
import { FileFormat } from 'datasources/Resource/types';
import {
    ServicesCodes,
    ServicesNames,
} from '../../../../services/subtitles/types';

type MovieSubtitlesSearchParams = {
    languages: ILanguage[];
    imdbId: string;
    season?: number;
    episode?: number;
};

type FileInfoResult = {
    url: string;
    fileName: string;
    format: string;
    encoding?: string;
    languageName?: string;
    languageCode?: string;
};

type SearchService = {
    code: ServicesCodes;
    name: ServicesNames;
};

type SearchResult = {
    service: SearchService;
    filesInfo: FileInfoResult[];
};

type FileInfoResponse = FileInfoResult & {
    format: FileFormat;
    language: ILanguage;
};

type SearchResponse = {
    service: SearchService;
    filesInfo: FileInfoResponse[];
};

export {
    MovieSubtitlesSearchParams,
    SearchResult,
    SearchResponse,
    FileInfoResult,
    FileInfoResponse,
    SearchService,
};
