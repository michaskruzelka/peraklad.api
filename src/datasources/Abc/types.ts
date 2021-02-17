enum ABCId {
    CYRILLIC = 1,
    LATIN = 2,
}

enum ABCCode {
    CYRILLIC = 'cyrillic',
    LATIN = 'latin',
}

type ABC = {
    id: ABCId;
    code: ABCCode;
};

type ABCResponse = ABC & {
    isDefault: boolean;
};

type ABCListResponse = ABCResponse[];

interface IDataSource {
    getABCs: () => ABC[];
    getDefaultABC: () => ABC;
}

export { ABC, ABCId, ABCCode, ABCListResponse, ABCResponse, IDataSource };
