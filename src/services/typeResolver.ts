import { GraphQLInterfaceType, GraphQLSchema } from 'graphql';
import { MovieType } from '../datasources/Movie/types';

/**
 * Workaround to query unions and interfaces
 *
 * @see https://community.neo4j.com/t/how-to-query-an-interface/3486/14
 *
 * as it should work in general as described here:
 * https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/
 */
const resolveTypes = (schema: GraphQLSchema): void => {
    const IMovieGraphQLType = schema.getTypeMap()
        .IMovie as GraphQLInterfaceType;
    IMovieGraphQLType.resolveType = (obj: any) => {
        if (obj.Type === MovieType.EPISODE) {
            return 'Episode';
        }

        if (obj.Type === MovieType.MOVIE) {
            return 'Movie';
        }

        if (obj.Type === MovieType.SERIES) {
            return 'Series';
        }

        return null;
    };
};

export { resolveTypes };
