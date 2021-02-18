interface IDataSource {
    getList: (limit: number, type: ListType) => ILanguage[];
    get: (code: string) => ILanguage;
    getCurrentLocale: () => Locale;
    isValidCodes(codes: string[]): boolean;
}

interface ILanguage {
    code: string;
    iso639_2: string;
    name: string;
    native: string;
}

enum Locale {
    BE = 'be',
    UK = 'uk',
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

export { IDataSource, ILanguage, Locale, ListArgs, GetOneArg, ListType };
