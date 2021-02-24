import { Spelling } from '../Spelling/types';
import { IABC } from '../ABC/types';
import { SearchParams, } from './Category/types';
import { IResource } from '../Resource/types';

enum StatusID {
    NEW = 1,
    IN_PROGRESS = 2,
    COMPLETED = 3,
    FAILED = 4,
    DELETED = 5,
}

enum StatusCode {
    NEW = 'new',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    FAILED = 'failed',
    DELETED = 'deleted',
}

type Status = {
    id: StatusID;
    code: StatusCode;
};

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

enum SubCategory {
    MOVIE = 'MOVIE',
    VIDEO_STREAM = 'VIDEO_STREAM',
}

type IMDBSubtitlesArgs = {
    languages: string[];
    imdbId: string;
    season?: number | null;
    episode?: number | null;
    limit?: number | null;
};

type IProject = {
    level: Level;
    resource: IResource;
    category: Category;
    subCategory?: SubCategory;
};

type ProjectSettings = {
    abc: IABC;
    spelling: Spelling;
    status: Status;
    access: AccessType;
};

interface IDataSource {
    getAccessTypes: () => AccessType[];
    getDefaultAccessType: () => AccessType;
    getAccessTypeById: (id: number) => AccessType;
    getLevelById: (id: number) => Level;
    getStatusById: (id: number) => Status;
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
    SubCategory,
    IMDBSubtitlesArgs,
    IProject,
    ProjectSettings,
    Status,
    StatusID,
    StatusCode,
};
