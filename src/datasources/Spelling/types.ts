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
};

type SpellingResponse = Spelling & {
    isDefault: boolean;
};

type SpellingListResponse = SpellingResponse[];

interface IDataSource {
    getSpellings: () => Spelling[];
    getDefaultSpelling: () => Spelling;
}

export {
    SpellingID,
    SpellingCode,
    Spelling,
    SpellingResponse,
    SpellingListResponse,
    IDataSource,
};
