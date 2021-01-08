import { ApolloServer } from 'apollo-server-lambda';

import { driver } from './neo4j';
import schema from './schema';
import { getDataSources } from './datasources';

const server = new ApolloServer({
    context: ({ req }) => {
        return {
            req,
            driver,
            neo4jDatabase: process.env.NEO4J_DATABASE,
        };
    },
    schema,
    dataSources: getDataSources,
    introspection: true,
    playground: true,
});

exports.handler = server.createHandler();
