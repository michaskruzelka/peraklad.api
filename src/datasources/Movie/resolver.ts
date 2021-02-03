import { DataSources } from 'datasources/types';
import {
    IEpisode,
    IMovie,
    MovieType,
    SearchByIdArgs,
    SearchByTitlePlusYearArgs,
} from './types';

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
    Episode: {
        series: async (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): Promise<IMovie> => {
            let series: IMovie;

            try {
                series = await dataSources.movie.searchByImdbId(
                    episode.seriesId
                );
            } catch (e) {
                series = dataSources.movie.createEmptyObject(
                    episode.seriesId,
                    MovieType.SERIES
                );
            }

            return series;
        },
    },
};

export default resolver;
