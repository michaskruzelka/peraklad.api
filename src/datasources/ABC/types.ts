enum ABCId {
    CYRILLIC = 1,
    LATIN = 2,
}

enum ABCCode {
    CYRILLIC = 'cyrillic',
    LATIN = 'latin',
}

interface IABC {
    id: ABCId;
    code: ABCCode;
}

interface IResolvedABC extends IABC {
    isDefault: boolean;
}

interface IDataSource {
    getABCs: () => IABC[];
    getDefaultABC: () => IABC;
    getABCById: (id: number) => IABC;
}

export { IABC, ABCId, ABCCode, IResolvedABC, IDataSource };
