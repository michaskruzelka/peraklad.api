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

type ResolvedSpelling = Spelling & {
    isDefault: boolean;
};

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
    IDataSource,
};
