interface IDataSource {
    getList: (limit: number, type: ListType) => ILanguage[];
    get: (code: string) => ILanguage;
    getCurrentLocale: () => LocaleShort;
    isValidCodes(codes: string[]): boolean;
}

interface ILanguage {
    code: string;
    iso639_2: string;
    name: string;
    native: string;
}

enum LocaleShort {
    BE = 'be',
    UK = 'uk',
}

enum LocaleFull {
    BE = 'be-BY',
    UK = 'uk-UA',
}

type ListArgs = {
    limit?: number;
    type?: ListType;
};

type GetOneArg = {
    code: string;
};

enum ListType {
    ALL = 'ALL',
    PRIMARY = 'PRIMARY',
    REMAINING = 'REMAINING',
}

export { IDataSource, ILanguage, LocaleShort, LocaleFull, ListArgs, GetOneArg, ListType };
