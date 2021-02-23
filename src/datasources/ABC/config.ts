import { IABC, ABCId, ABCCode } from './types';

const ABC_LIST: IABC[] = [
    {
        id: ABCId.CYRILLIC,
        code: ABCCode.CYRILLIC,
    },
    {
        id: ABCId.LATIN,
        code: ABCCode.LATIN,
    },
];

const DEFAULT_ABC: ABCId = ABCId.CYRILLIC;

export { ABC_LIST, DEFAULT_ABC };
