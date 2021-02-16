import { AccessType, AccessTypeID, AccessTypeCode } from './types';

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

export { ACCESS_TYPES, DEFAULT_ACCESS_TYPE };
