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
    IDataSource,
};
