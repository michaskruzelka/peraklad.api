import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { DocumentNode, GraphQLSchema } from 'graphql';
import { makeAugmentedSchema } from 'neo4j-graphql-js';
import resolvers from './resolvers';

const graphqlFiles: GraphQLSchema[] = loadFilesSync('./**/*.graphql');
const typeDefs: DocumentNode = mergeTypeDefs(graphqlFiles);

const schema = makeAugmentedSchema({
    typeDefs,
    resolvers,
    config: {
        query: {
            exclude: ['Language', 'GroupedLanguages'],
        },
        mutation: {
            exclude: ['Language', 'GroupedLanguages'],
        },
    },
});

export default schema;
