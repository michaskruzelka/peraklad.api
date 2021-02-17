import { Spelling, SpellingID, SpellingCode } from './types';

const SPELLINGS: Spelling[] = [
    {
        id: SpellingID.ACADEMIC,
        code: SpellingCode.ACADEMIC,
    },
    {
        id: SpellingID.CLASSIC,
        code: SpellingCode.CLASSIC,
    },
];

const DEFAULT_SPELLING = SpellingID.ACADEMIC;

export { SPELLINGS, DEFAULT_SPELLING };
