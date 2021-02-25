import { DataSources } from '../types';
import { Logger } from 'winston';
import {
    IOMDB,
    IEpisode,
    IMovie,
    ISeries,
    OMDBType,
    SearchByIdArgs,
    SearchByTitlePlusYearArgs,
    EpisodesArgs,
} from './types';

const getImdbRating = (omdb: IOMDB, dataSources: DataSources) => {
    const validRating = dataSources.omdb.asEmpty(omdb.imdbRating);

    return validRating ? dataSources.omdb.asFloat(validRating) : null;
};

const getYear = (omdb: IEpisode | IMovie, dataSources: DataSources) => {
    const validYear = dataSources.omdb.asEmpty(omdb.Year);

    return validYear ? dataSources.omdb.asInt(validYear) : null;
};

const getLanguage = (omdb: IMovie | ISeries, dataSources: DataSources) => {
    return dataSources.language.getByName(omdb.Language).code;
};

const resolver = {
    Query: {
        imdbInfoByImdbId: async (
            _: any,
            args: SearchByIdArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<IOMDB> => {
            return dataSources.omdb.searchByImdbId(args.imdbId);
        },
        imdbInfoByTitleAndYear: async (
            _: any,
            args: SearchByTitlePlusYearArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<IOMDB> => {
            return dataSources.omdb.searchByTitleAndYear(args.title, args.year);
        },
        imdbTypes: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): OMDBType[] => {
            return dataSources.omdb.getOMDBTypes();
        },
    },
    OMDBEpisode: {
        series: async (
            episode: IEpisode,
            __: any,
            {
                dataSources,
                logger,
            }: { dataSources: DataSources; logger: Logger }
        ): Promise<IOMDB> => {
            let series: IOMDB;

            try {
                series = await dataSources.omdb.searchByImdbId(
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
                series = dataSources.omdb.createEmptyBaseMovieObject();
                series.imdbId = dataSources.omdb.asEmpty(episode.seriesID);
                series.type = OMDBType.SERIES;
                series.Type = OMDBType.SERIES;
            }

            return series;
        },
        seasonNum: (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number => {
            return dataSources.omdb.asInt(episode.Season);
        },
        episodeNum: (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number => {
            return dataSources.omdb.asInt(episode.Episode);
        },
        year: (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number | null => {
            return getYear(episode, dataSources);
        },
        imdbRating: (
            episode: IEpisode,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number | null => {
            return getImdbRating(episode, dataSources);
        },
    },
    OMDBMovie: {
        language: (
            movie: IMovie,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): string => {
            return getLanguage(movie, dataSources);
        },
        year: (
            movie: IMovie,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number | null => {
            return getYear(movie, dataSources);
        },
        imdbRating: (
            movie: IMovie,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): number | null => {
            return getImdbRating(movie, dataSources);
        },
    },
    OMDBSeries: {
        language: (
            series: ISeries,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): string => {
            return getLanguage(series, dataSources);
        },
        episodes: async (
            series: ISeries,
            args: EpisodesArgs,
            { dataSources }: { dataSources: DataSources }
        ): Promise<IOMDB[]> => {
            if (args.season) {
                return await dataSources.omdb.searchForEpisodes(
                    series.imdbId,
                    args.season,
                    args.episode
                );
            }

            let episodes: IOMDB[] = [];
            const seasonsCount = dataSources.omdb.asInt(series.totalSeasons);
            if (seasonsCount) {
                for (
                    let seasonNum = 1;
                    seasonNum <= seasonsCount;
                    seasonNum++
                ) {
                    episodes = [
                        ...episodes,
                        ...(await dataSources.omdb.searchForEpisodes(
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
            return getImdbRating(series, dataSources);
        },
    },
};

export default resolver;
