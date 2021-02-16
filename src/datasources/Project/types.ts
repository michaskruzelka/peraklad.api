enum AccessTypeID {
    PUBLIC = 1,
    RESTRICTED = 2,
    PRIVATE = 3,
}

enum AccessTypeCode {
    PUBLIC = 'public',
    RESTRICTED = 'restricted',
    PRIVATE = 'private',
}

type AccessType = {
    id: AccessTypeID;
    code: AccessTypeCode;
};

type AccessTypeResponse = AccessType & {
    isDefault: boolean;
};

type AccessTypeListResponse = AccessTypeResponse[];

enum LevelID {
    PARENT = 1,
    SUB = 2,
    SELF = 3,
}

enum LevelCode {
    PARENT = 'PARENT',
    SUB = 'SUB',
    SELF = 'SELF',
}

type Level = {
    id: LevelID;
    code: LevelCode;
};

enum Category {
    SUBTITLES = 'SUBTITLES',
    SOFTWARE = 'SOFTWARE',
}

enum SubtitlesSubcategory {
    OFFLINE = 'OFFLINE',
    ONLINE = 'ONLINE',
}

interface IDataSource {
    getAccessTypes: () => AccessType[];
    getDefaultAccessType: () => AccessType;
}

export {
    AccessTypeID,
    AccessTypeCode,
    AccessType,
    AccessTypeResponse,
    AccessTypeListResponse,
    LevelID,
    LevelCode,
    Level,
    IDataSource,
    Category,
    SubtitlesSubcategory,
};
