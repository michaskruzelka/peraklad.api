import { OMDBType, OMDBTypeCode } from './types';

const OMDB_API_KEY = process.env.OMDB_API_KEY as string;
const OMDB_API_HOSTNAME = 'http://www.omdbapi.com';
const OMDB_TYPES: OMDBType[] = [
    {
        code: OMDBTypeCode.MOVIE,
        name: OMDBTypeCode.MOVIE,
    },
    {
        code: OMDBTypeCode.EPISODE,
        name: OMDBTypeCode.EPISODE,
    },
    {
        code: OMDBTypeCode.SERIES,
        name: OMDBTypeCode.SERIES,
    },
];

export { OMDB_API_KEY, OMDB_API_HOSTNAME, OMDB_TYPES };
