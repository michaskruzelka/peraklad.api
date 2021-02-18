import { OfflineSearchParams } from '../../datasources/Project/Category/Subtitles/types';

type SearchParams = OfflineSearchParams;

enum ServicesCodes {
    OS = 'opensubtitles',
}

enum ServicesNames {
    OS = 'OpenSubtitles',
}

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
};
