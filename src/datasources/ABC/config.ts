import { IABCList, ABCId, ABCCode, IABC } from './types';
import { Locale } from '../Language/types';

const CYRILLIC_ABC: IABC = {
    id: ABCId.CYRILLIC,
    code: ABCCode.CYRILLIC,
    name: ABCCode.CYRILLIC,
};

const LATIN_ABC: IABC = {
    id: ABCId.LATIN,
    code: ABCCode.LATIN,
    name: ABCCode.LATIN,
};

const ABC_LIST: IABCList = {
    [Locale.BE]: [CYRILLIC_ABC, LATIN_ABC],
    [Locale.UK]: [CYRILLIC_ABC],
};

const DEFAULT_ABC = {
    [Locale.BE]: CYRILLIC_ABC,
    [Locale.UK]: CYRILLIC_ABC,
};

export { ABC_LIST, DEFAULT_ABC, CYRILLIC_ABC };
