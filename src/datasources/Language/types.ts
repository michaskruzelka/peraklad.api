export interface IDataSource {
    getList: (limit: number, type: ListType) => ILanguage[];
    get: (code: string) => ILanguage;
    getCurrentLocale: () => Locale;
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

export type ListArgs = {
    limit?: number;
    type?: ListType;
};

export type GetOneArg = {
    code: string;
};

export enum ListType {
    ALL = 'ALL',
    PRIMARY = 'PRIMARY',
    REMAINING = 'REMAINING',
}
