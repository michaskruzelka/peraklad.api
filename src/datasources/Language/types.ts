export interface IDataSource {
    getList: () => ILanguage[];
    getCurrentLocale: () => Locale;
    getDefaultLocale: () => Locale;
}

export interface ILanguage {
    code: string;
    name: string;
    native: string;
}

export enum Locale {
    BE = 'be',
    UK = 'uk',
}

export type ListParams = {
    limit?: number;
    type?: ListType;
};

export enum ListType {
    ALL = 'ALL',
    PRIMARY = 'PRIMARY',
    REMAINING = 'REMAINING',
}

export interface GroupedLanguages {
    PRIMARY: ILanguage[];
    REMAINING: ILanguage[];
}
