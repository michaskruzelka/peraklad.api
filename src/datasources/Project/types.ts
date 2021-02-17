import { ICategory } from './Category/types';

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

enum SubtitlesSubCategory {
    OFFLINE = 'OFFLINE',
    ONLINE = 'ONLINE',
}

type IMDBSubtitlesArgs = {
    language: string;
    imdbId?: string | null;
    title?: string | null;
};

interface IDataSource {
    getAccessTypes: () => AccessType[];
    getDefaultAccessType: () => AccessType;
    getCategory(): ICategory;
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
    SubtitlesSubCategory,
    IMDBSubtitlesArgs,
};
