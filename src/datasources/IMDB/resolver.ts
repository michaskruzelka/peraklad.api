import { DataSources } from 'datasources/types';
import { Logger } from 'winston';
import {
    IIMDB,
    IEpisode,
    IMovie,
    ISeries,
    IMDBType,
    SearchByIdArgs,
    SearchByTitlePlusYearArgs,
    EpisodesArgs,
} from './types';

const resolver = {
    IMDB: {
        __resolveType: (obj: any) => {
            if (obj.Type === IMDBType.EPISODE) {
                return 'Episode';
            }

            if (obj.Type === IMDBType.MOVIE) {
                return 'Movie';
            }

            if (obj.Type === IMDBType.SERIES) {
                return 'Series';
            }

            return null;
        },
    },
    Query: {
        imdbInfoByImdbId: async (
            _: any,
            args: SearchByIdArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<IIMDB> => {
            return dataSources.imdb.searchByImdbId(args.imdbId);
        },
        imdbInfoByTitleAndYear: async (
            _: any,
            args: SearchByTitlePlusYearArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<IIMDB> => {
            return dataSources.imdb.searchByTitleAndYear(args.title, args.year);
        },
        imdbTypes: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): IMDBType[] => {
            return dataSources.imdb.getIMDBTypes();
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
        ): Promise<IIMDB> => {
            let series: IIMDB;

            try {
                series = await dataSources.imdb.searchByImdbId(
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
                series = dataSources.imdb.createEmptyBaseMovieObject();
                series.imdbId = dataSources.imdb.asEmpty(episode.seriesID);
                series.type = IMDBType.SERIES;
                series.Type = IMDBType.SERIES;
            }

            return series;
        },
        seasonNum: (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number => {
            return dataSources.imdb.asInt(episode.Season);
        },
        episodeNum: (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number => {
            return dataSources.imdb.asInt(episode.Episode);
        },
        year: (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number | null => {
            const validYear = dataSources.imdb.asEmpty(episode.Year);
            
            return validYear ? dataSources.imdb.asInt(validYear) : null;
        },
        imdbRating: (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number | null => {
            const validRating = dataSources.imdb.asEmpty(episode.imdbRating);

            return validRating ? dataSources.imdb.asFloat(validRating) : null;
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
        ): number | null => {
            const validYear = dataSources.imdb.asEmpty(movie.Year);
            
            return validYear ? dataSources.imdb.asInt(validYear) : null;
        },
        imdbRating: (
            movie: IMovie,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number | null => {
            const validRating = dataSources.imdb.asEmpty(movie.imdbRating);

            return validRating ? dataSources.imdb.asFloat(validRating) : null;
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
        ): Promise<IIMDB[]> => {
            if (args.season) {
                return await dataSources.imdb.searchForEpisodes(
                    series.imdbId,
                    args.season,
                    args.episode
                );
            }

            let episodes: IIMDB[] = [];
            const seasonsCount = dataSources.imdb.asInt(series.totalSeasons);
            if (seasonsCount) {
                for (
                    let seasonNum = 1;
                    seasonNum <= seasonsCount;
                    seasonNum++
                ) {
                    episodes = [
                        ...episodes,
                        ...(await dataSources.imdb.searchForEpisodes(
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
        ): number | null => {
            const validRating = dataSources.imdb.asEmpty(series.imdbRating);

            return validRating ? dataSources.imdb.asFloat(validRating) : null;
        },
    },
};

export default resolver;
