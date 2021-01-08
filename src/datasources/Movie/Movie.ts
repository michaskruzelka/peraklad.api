import { DataSource } from 'apollo-datasource';
import { OMDB_API_KEY } from './config';

class Movie extends DataSource {
    private apiKey: string;

    constructor() {
        super();

        if (!OMDB_API_KEY) {
            throw new Error('Movie search api key is not provided.');
        }

        this.apiKey = OMDB_API_KEY;
    }

    public searchByImdbId() {}

    public searchByTitleAndYear() {}
}

export { Movie };
