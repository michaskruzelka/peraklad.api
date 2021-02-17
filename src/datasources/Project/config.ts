import {
    AccessType,
    AccessTypeID,
    AccessTypeCode,
    Level,
    LevelID,
    LevelCode,
} from './types';

const ACCESS_TYPES: AccessType[] = [
    {
        id: AccessTypeID.PUBLIC,
        code: AccessTypeCode.PUBLIC,
    },
    {
        id: AccessTypeID.RESTRICTED,
        code: AccessTypeCode.RESTRICTED,
    },
    {
        id: AccessTypeID.PRIVATE,
        code: AccessTypeCode.PRIVATE,
    },
];

const DEFAULT_ACCESS_TYPE = AccessTypeID.RESTRICTED;

const PARENT_LEVEL: Level = {
    id: LevelID.PARENT,
    code: LevelCode.PARENT,
};

const SUB_LEVEL: Level = {
    id: LevelID.SUB,
    code: LevelCode.SUB,
};

const SELF_LEVEL: Level = {
    id: LevelID.SELF,
    code: LevelCode.SELF,
};

const LEVELS: Level[] = [SELF_LEVEL, SUB_LEVEL, PARENT_LEVEL];

export {
    ACCESS_TYPES,
    DEFAULT_ACCESS_TYPE,
    PARENT_LEVEL,
    SUB_LEVEL,
    SELF_LEVEL,
    LEVELS,
};
