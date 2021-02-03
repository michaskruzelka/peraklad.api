import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { DocumentNode, GraphQLSchema, GraphQLInterfaceType } from 'graphql';
import { makeAugmentedSchema } from 'neo4j-graphql-js';

import resolvers from './resolvers';
import { MovieType } from './datasources/Movie/types';

const graphqlFiles: GraphQLSchema[] = loadFilesSync('./**/*.graphql');
const typeDefs: DocumentNode = mergeTypeDefs(graphqlFiles);

const schema = makeAugmentedSchema({
    typeDefs,
    resolvers,
    config: {
        query: {
            exclude: [
                'Language',
                'GroupedLanguages',
                'Movie',
                'Episode',
                'IMovie',
            ],
        },
        mutation: {
            exclude: [
                'Language',
                'GroupedLanguages',
                'Movie',
                'Episode',
                'IMovie',
            ],
        },
    },
});

/**
 * Workaround to query unions and interfaces
 *
 * @see https://community.neo4j.com/t/how-to-query-an-interface/3486/14
 *
 * as it should work in general as described here:
 * https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/
 */
const IMovieGraphQLType = schema.getTypeMap().IMovie as GraphQLInterfaceType;
IMovieGraphQLType.resolveType = (obj: any) => {
    return obj.type === MovieType.EPISODE ? 'Episode' : 'Movie';
};

export default schema;
