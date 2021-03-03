import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-lambda';

import { ITokenInfo } from './types';
import { JWT_SECRET_KEY } from './config';

const authorize = (authHeader: string): ITokenInfo => {
    try {
        const tokenInfo = parseToken(authHeader);
        if (tokenInfo) {
            return {
                abc: parseInt(tokenInfo.abc) || undefined,
                spelling: parseInt(tokenInfo.spelling) || undefined,
            };
        }
    } catch (e) {}

    throw new AuthenticationError(
        'The request is not authorized to perform this operation.'
    );
};

const parseToken = (authHeader: string): any => {
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');

        return jwt.verify(token, JWT_SECRET_KEY) || '';
    }

    return '';
};

export { authorize };
