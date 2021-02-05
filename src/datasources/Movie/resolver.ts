import { DataSources } from 'datasources/types';
import { Logger } from 'winston';
import {
    IBaseMovie,
    IEpisode,
    IMovie,
    ISeries,
    MovieType,
    SearchByIdArgs,
    SearchByTitlePlusYearArgs,
    EpisodesArgs,
} from './types';

const resolver = {
    Query: {
        movieByImdbId: async (
            _: any,
            args: SearchByIdArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<IBaseMovie> => {
            return dataSources.movie.searchByImdbId(args.imdbId);
        },
        movieByTitleAndYear: async (
            _: any,
            args: SearchByTitlePlusYearArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<IBaseMovie> => {
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
            {
                dataSources,
                logger,
            }: { dataSources: DataSources; logger: Logger }
        ): Promise<IBaseMovie> => {
            let series: IBaseMovie;

            try {
                series = await dataSources.movie.searchByImdbId(
                    episode.seriesID
                );
            } catch (e) {
                logger.log(
                    'info',
                    'Could not find series with imdbId = ' +
                        episode.seriesID +
                        ': ' +
                        e.message
                );
                series = dataSources.movie.createEmptyBaseMovieObject();
                series.imdbId = dataSources.movie.asEmpty(episode.seriesID);
                series.type = MovieType.SERIES;
                series.Type = MovieType.SERIES;
            }

            return series;
        },
        seasonNum: (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number => {
            return dataSources.movie.asInt(episode.Season);
        },
        episodeNum: (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number => {
            return dataSources.movie.asInt(episode.Episode);
        },
        year: (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number => {
            return dataSources.movie.asInt(episode.Year);
        },
        imdbRating: (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number => {
            return dataSources.movie.asFloat(episode.imdbRating);
        },
    },
    Movie: {
        language: (
            movie: IMovie,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): string => {
            return dataSources.language.getByName(movie.Language).code;
        },
        year: (
            movie: IMovie,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number => {
            return dataSources.movie.asInt(movie.Year);
        },
        imdbRating: (
            movie: IMovie,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number => {
            return dataSources.movie.asFloat(movie.imdbRating);
        },
    },
    Series: {
        language: (
            series: ISeries,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): string => {
            return dataSources.language.getByName(series.Language).code;
        },
        episodes: async (
            series: ISeries,
            args: EpisodesArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<IBaseMovie[]> => {
            if (args.season) {
                return await dataSources.movie.searchForEpisodes(
                    series.imdbId,
                    args.season,
                    args.episode
                );
            }

            let episodes: IBaseMovie[] = [];
            const seasonsCount = dataSources.movie.asInt(series.totalSeasons);
            if (seasonsCount) {
                for (
                    let seasonNum = 1;
                    seasonNum <= seasonsCount;
                    seasonNum++
                ) {
                    episodes = [
                        ...episodes,
                        ...(await dataSources.movie.searchForEpisodes(
                            series.imdbId,
                            seasonNum,
                            args.episode
                        )),
                    ];
                }
            }

            return episodes;
        },
        imdbRating: (
            series: ISeries,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number => {
            return dataSources.movie.asFloat(series.imdbRating);
        },
    },
};

export default resolver;
