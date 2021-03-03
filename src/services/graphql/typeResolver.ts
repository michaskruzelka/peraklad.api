import { GraphQLInterfaceType, GraphQLSchema } from 'graphql';
import { OMDBTypeCode } from '../../datasources/OMDB/types';

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
        if (obj.Type === OMDBTypeCode.EPISODE) {
            return 'OMDBEpisode';
        }

        if (obj.Type === OMDBTypeCode.MOVIE) {
            return 'OMDBMovie';
        }

        if (obj.Type === OMDBTypeCode.SERIES) {
            return 'OMDBSeries';
        }

        return null;
    };
};

export { resolveTypes };
