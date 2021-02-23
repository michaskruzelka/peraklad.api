import { ApolloServer } from 'apollo-server-lambda';
import { graphql } from './services';

(async () => {
    const server = new ApolloServer(await graphql.apollo.getConfig());
    exports.handler = server.createHandler();
})();

// Uncomment the code below in case you want to close some connections
// (for example, logger.close()) after the run

// const handler = async (event: any, context: any) => {
//     const logger = getLogger();
//     const server = new ApolloServer({
//         context: ({ req }) => {
//             return {
//                 req,
//                 driver,
//                 neo4jDatabase: process.env.NEO4J_DATABASE,
//                 logger,
//             };
//         },
//         schema,
//         dataSources: getDataSources,
//         introspection: true,
//         playground: true,
//     });

//     const run = (event: any, context: any) => {
//         return new Promise((resolve: any, reject: any) => {
//             const callback = (error: any, body: any) =>
//                 error ? reject(error) : resolve(body);
//             server.createHandler()(event, context, callback);
//         });
//     };

//     const response = await run(event, context);
//     logger.close();

//     return response;
// };

// exports.handler = handler;
