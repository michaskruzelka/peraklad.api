import { ApolloServer } from 'apollo-server';
import { graphql } from './services';

const server = new ApolloServer(graphql.apollo.config);

if (process.env.NODE_ENV !== 'test') {
    server.listen().then(() => {
        console.log(`
        Server is running!
        Listening on port 4000
      `);
    });
}
