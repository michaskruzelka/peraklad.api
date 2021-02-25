import { OMDBType } from './types';

const OMDB_API_KEY = process.env.OMDB_API_KEY as string;
const OMDB_API_HOSTNAME = 'http://www.omdbapi.com';
const OMDB_TYPES: OMDBType[] = [
    OMDBType.MOVIE,
    OMDBType.EPISODE,
    OMDBType.SERIES,
];

export { OMDB_API_KEY, OMDB_API_HOSTNAME, OMDB_TYPES };
