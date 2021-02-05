import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { DocumentNode, GraphQLSchema } from 'graphql';
import { makeAugmentedSchema } from 'neo4j-graphql-js';

import resolvers from './resolvers';
import { resolveTypes } from './services';

const graphqlFiles: GraphQLSchema[] = loadFilesSync('./**/*.graphql');
const typeDefs: DocumentNode = mergeTypeDefs(graphqlFiles);

const schema: GraphQLSchema = makeAugmentedSchema({
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
                'Series',
            ],
        },
        mutation: {
            exclude: [
                'Language',
                'GroupedLanguages',
                'Movie',
                'Episode',
                'IMovie',
                'Series',
            ],
        },
    },
});

resolveTypes(schema);

export default schema;
