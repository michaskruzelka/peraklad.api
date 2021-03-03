import {
    AccessType,
    AccessTypeID,
    AccessTypeCode,
    Level,
    LevelID,
    LevelCode,
    Status,
    StatusID,
    StatusCode,
    Category,
    SubCategory,
} from './types';

const STATUSES: Status[] = [
    {
        id: StatusID.NEW,
        code: StatusCode.NEW,
        name: StatusCode.NEW,
    },
    {
        id: StatusID.IN_PROGRESS,
        code: StatusCode.IN_PROGRESS,
        name: StatusCode.IN_PROGRESS,
    },
    {
        id: StatusID.COMPLETED,
        code: StatusCode.COMPLETED,
        name: StatusCode.COMPLETED,
    },
    {
        id: StatusID.FAILED,
        code: StatusCode.FAILED,
        name: StatusCode.FAILED,
    },
    {
        id: StatusID.DELETED,
        code: StatusCode.DELETED,
        name: StatusCode.DELETED,
    },
];

const ACCESS_TYPES: AccessType[] = [
    {
        id: AccessTypeID.PUBLIC,
        code: AccessTypeCode.PUBLIC,
        name: AccessTypeCode.PUBLIC,
    },
    {
        id: AccessTypeID.RESTRICTED,
        code: AccessTypeCode.RESTRICTED,
        name: AccessTypeCode.RESTRICTED,
    },
    {
        id: AccessTypeID.PRIVATE,
        code: AccessTypeCode.PRIVATE,
        name: AccessTypeCode.PRIVATE,
    },
];

const DEFAULT_ACCESS_TYPE = AccessTypeID.RESTRICTED;

const LEVELS: Level[] = [
    {
        id: LevelID.PARENT,
        code: LevelCode.PARENT,
    },
    {
        id: LevelID.SUB,
        code: LevelCode.SUB,
    },
    {
        id: LevelID.SELF,
        code: LevelCode.SELF,
    },
];

const CATEGORIES = [
    {
        code: Category.SUBTITLES,
        labels: ['MovieSubtitles', 'VideoStreamSubtitles'],
    },
    {
        code: Category.SOFTWARE,
        labels: ['Software'],
    },
];

const SUBCATEGORIES = [
    {
        code: SubCategory.MOVIE,
        labels: ['MovieSubtitles'],
    },
    {
        code: SubCategory.VIDEO_STREAM,
        labels: ['VideoStreamSubtitles'],
    },
];

export {
    ACCESS_TYPES,
    DEFAULT_ACCESS_TYPE,
    LEVELS,
    STATUSES,
    CATEGORIES,
    SUBCATEGORIES,
};
