import { ILanguage } from 'datasources/Language/types';

type OfflineSearchParams = {
    language: ILanguage;
    imdbId?: string | null;
    title?: string | null;
};

export { OfflineSearchParams };
