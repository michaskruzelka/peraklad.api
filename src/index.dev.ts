import { ApolloServer } from 'apollo-server';
import { graphql } from './services';

(async () => {
    const server = new ApolloServer(await graphql.apollo.getConfig());

    if (process.env.NODE_ENV !== 'test') {
        await server.listen();
        console.log(
            `Server is running!
             Listening on port 4000`
        );
    }
})();
