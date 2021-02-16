import { IMDBType } from './types';

const OMDB_API_KEY = process.env.OMDB_API_KEY as string;
const OMDB_API_HOSTNAME = 'http://www.omdbapi.com';
const IMDB_TYPES: IMDBType[] = [
    IMDBType.MOVIE,
    IMDBType.EPISODE,
    IMDBType.SERIES,
];

export { OMDB_API_KEY, OMDB_API_HOSTNAME, IMDB_TYPES };
