import { Spelling, SpellingID, SpellingCode, ISpellingList } from './types';
import { LocaleShort } from '../Language/types';

const ACADEMIC_SPELLING: Spelling = {
    id: SpellingID.ACADEMIC,
    code: SpellingCode.ACADEMIC,
    name: SpellingCode.ACADEMIC,
};

const CLASSIC_SPELLING: Spelling = {
    id: SpellingID.CLASSIC,
    code: SpellingCode.CLASSIC,
    name: SpellingCode.CLASSIC,
};

const SPELLINGS: ISpellingList = {
    [LocaleShort.BE]: [ACADEMIC_SPELLING, CLASSIC_SPELLING],
    [LocaleShort.UK]: [ACADEMIC_SPELLING],
};

const DEFAULT_SPELLING = {
    [LocaleShort.BE]: ACADEMIC_SPELLING,
    [LocaleShort.UK]: ACADEMIC_SPELLING,
};

export { SPELLINGS, DEFAULT_SPELLING, ACADEMIC_SPELLING };
