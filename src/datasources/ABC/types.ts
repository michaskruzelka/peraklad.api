import { Locale } from '../Language/types';

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
    name: String;
}

interface IABCList {
    [Locale.BE]: IABC[];
    [Locale.UK]: IABC[];
}

interface IResolvedABC extends IABC {
    isDefault: boolean;
}

interface IDataSource {
    getABCs: () => IABC[];
    getDefaultABC: () => IABC;
    getABCById: (id: number) => IABC;
    validateId: (id: number) => void;
}

export { IABC, ABCId, ABCCode, IABCList, IResolvedABC, IDataSource };
