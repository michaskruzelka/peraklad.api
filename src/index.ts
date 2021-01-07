import { ApolloServer } from 'apollo-server-lambda';

import { driver } from './neo4j';
import schema from './schema';

const server = new ApolloServer({
    context: { driver, neo4jDatabase: process.env.NEO4J_DATABASE },
    schema,
    introspection: true,
    playground: true,
});

exports.handler = server.createHandler();
