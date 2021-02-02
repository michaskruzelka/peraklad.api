import { DataSources } from 'datasources/types';
import { IMovie, SearchByIdArgs, SearchByTitlePlusYearArgs } from './types';

const resolver = {
    Query: {
        movieByImdbId: async (
            _: any,
            args: SearchByIdArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<IMovie> => {
            return dataSources.movie.searchByImdbId(args.imdbId);
        },
        movieByTitleAndYear: async (
            _: any,
            args: SearchByTitlePlusYearArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<IMovie> => {
            return dataSources.movie.searchByTitleAndYear(
                args.title,
                args.year
            );
        },
    },
};

export default resolver;
