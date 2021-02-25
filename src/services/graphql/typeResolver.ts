import { GraphQLInterfaceType, GraphQLSchema } from 'graphql';
import { OMDBType } from '../../datasources/OMDB/types';

/**
 * Workaround to query unions and interfaces
 *
 * @see https://community.neo4j.com/t/how-to-query-an-interface/3486/14
 *
 * as it should work in general as described here:
 * https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/
 */
const resolveTypes = (schema: GraphQLSchema): void => {
    const IMDBGraphQLType = schema.getTypeMap().OMDB as GraphQLInterfaceType;
    IMDBGraphQLType.resolveType = (obj: any) => {
        if (obj.Type === OMDBType.EPISODE) {
            return 'OMDBEpisode';
        }

        if (obj.Type === OMDBType.MOVIE) {
            return 'OMDBMovie';
        }

        if (obj.Type === OMDBType.SERIES) {
            return 'OMDBSeries';
        }

        return null;
    };
};

export { resolveTypes };
