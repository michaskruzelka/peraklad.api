import { SearchParams } from './Category/types';

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

type ResolvedAccessType = AccessType & {
    isDefault: boolean;
};

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
    languages: string[];
    imdbId: string;
    season?: number | null;
    episode?: number | null;
    limit?: number | null;
};

type Project = {
    level: Level;
};

type ProjectSettings = {
    abcId: number;
    accessId: number;
    spellingId: number;
    statusId: number;
    access: AccessType;
};

interface IDataSource {
    getAccessTypes: () => AccessType[];
    getDefaultAccessType: () => AccessType;
    getAccessTypeById: (id: number) => AccessType;
    getLevelById: (id: number) => Level;
    searchForFiles(searchParams: SearchParams, limit?: number): Promise<any>;
}

export {
    AccessTypeID,
    AccessTypeCode,
    AccessType,
    ResolvedAccessType,
    LevelID,
    LevelCode,
    Level,
    IDataSource,
    Category,
    SubtitlesSubCategory,
    IMDBSubtitlesArgs,
    Project,
    ProjectSettings,
};
