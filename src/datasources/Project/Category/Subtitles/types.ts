import { ILanguage } from 'datasources/Language/types';
import { FileFormat } from 'datasources/Resource/types';

type OfflineSearchParams = {
    language: ILanguage;
    imdbId?: string | null;
    title?: string | null;
};

enum SearchServicesCodes {
    OS = 'opensubtitles',
}

type SearchService = {
    code: SearchServicesCodes;
    execute: (searchParams: OfflineSearchParams) => any;
};

type FileInfoResult = {
    url: string;
    fileName: string;
    encoding: string;
    format: string;
    language: ILanguage;
};

type SearchResult = {
    service?: SearchServicesCodes;
    filesInfo: FileInfoResult[];
};

type FileInfoResponse = FileInfoResult & {
    format: FileFormat;
};
type SearchResponse = {
    service?: SearchServicesCodes;
    filesInfo: FileInfoResponse[];
};

export {
    OfflineSearchParams,
    SearchServicesCodes,
    SearchService,
    SearchResult,
    SearchResponse,
    FileInfoResult,
};
