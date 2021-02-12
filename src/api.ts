import { ApolloServer } from 'apollo-server-lambda';
import depthLimit from 'graphql-depth-limit';

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
    validationRules: [depthLimit(10)],
});

exports.handler = server.createHandler();

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
