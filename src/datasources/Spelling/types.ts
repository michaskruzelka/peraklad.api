import { LocaleShort } from '../Language/types';

enum SpellingID {
    ACADEMIC = 1,
    CLASSIC = 2,
}

enum SpellingCode {
    ACADEMIC = 'academic',
    CLASSIC = 'classic',
}

type Spelling = {
    id: SpellingID;
    code: SpellingCode;
    name: string;
};

type ResolvedSpelling = Spelling & {
    isDefault: boolean;
};

interface ISpellingList {
    [LocaleShort.BE]: Spelling[];
    [LocaleShort.UK]: Spelling[];
}

interface IDataSource {
    getSpellings: () => Spelling[];
    getDefaultSpelling: () => Spelling;
    getById: (id: number) => Spelling;
}

export {
    SpellingID,
    SpellingCode,
    Spelling,
    ResolvedSpelling,
    ISpellingList,
    IDataSource,
};
