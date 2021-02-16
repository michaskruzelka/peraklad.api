import { MovieType } from './types';

const OMDB_API_KEY = process.env.OMDB_API_KEY as string;
const OMDB_API_HOSTNAME = 'http://www.omdbapi.com';
const MOVIE_TYPES: MovieType[] = [
    MovieType.MOVIE,
    MovieType.EPISODE,
    MovieType.SERIES,
];

export { OMDB_API_KEY, OMDB_API_HOSTNAME, MOVIE_TYPES };
