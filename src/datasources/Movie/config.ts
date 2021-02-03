import { MovieType } from './types';

export const OMDB_API_KEY = process.env.OMDB_API_KEY as string;
export const OMDB_API_HOSTNAME = 'http://www.omdbapi.com';
export const MOVIE_TYPES: MovieType[] = [
    MovieType.MOVIE,
    MovieType.EPISODE,
    MovieType.SERIES,
];
