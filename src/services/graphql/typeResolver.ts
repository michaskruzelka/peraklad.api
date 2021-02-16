import { GraphQLInterfaceType, GraphQLSchema } from 'graphql';
import { IMDBType } from '../../datasources/IMDB/types';

/**
 * Workaround to query unions and interfaces
 *
 * @see https://community.neo4j.com/t/how-to-query-an-interface/3486/14
 *
 * as it should work in general as described here:
 * https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/
 */
const resolveTypes = (schema: GraphQLSchema): void => {
    const IMDBGraphQLType = schema.getTypeMap().IMDB as GraphQLInterfaceType;
    IMDBGraphQLType.resolveType = (obj: any) => {
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
    };
};

export { resolveTypes };
