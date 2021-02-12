import { ApolloServer } from 'apollo-server';

import { driver } from './neo4j';
import schema from './schema';
import { getDataSources } from './datasources';
import { getLogger } from './services';

const server = new ApolloServer({
    context: ({ req }) => {
        return {
            req,
            driver,
            neo4jDatabase: process.env.NEO4J_DATABASE,
            logger: getLogger(),
        };
    },
    schema,
    dataSources: getDataSources,
    introspection: true,
    playground: true,
});

if (process.env.NODE_ENV !== 'test') {
    server.listen().then(() => {
        console.log(`
        Server is running!
        Listening on port 4000
      `);
    });
}
