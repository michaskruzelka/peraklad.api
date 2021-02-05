import { ApolloServer } from 'apollo-server-lambda';

import { driver } from './neo4j';
import schema from './schema';
import { getDataSources } from './datasources';
import { logger } from './services';

const server = new ApolloServer({
    context: ({ req }) => {
        return {
            req,
            driver,
            neo4jDatabase: process.env.NEO4J_DATABASE,
            logger
        };
    },
    schema,
    dataSources: getDataSources,
    introspection: true,
    playground: true,
});

exports.handler = server.createHandler();

// logger.close()


// ----- //
// const runHandler = (event: any, context: any, handler: any) =>
// 	new Promise((resolve, reject) => {
// 		const callback = (error: any, body: any) => (error ? reject(error) : resolve(body));

// 		handler(event, context, callback);
// 	});

// const run = async (event: any, context: any) => {
// 	const server = new ApolloServer({
//         context: ({ req }) => {
//             return {
//                 req,
//                 driver,
//                 neo4jDatabase: process.env.NEO4J_DATABASE,
//                 logger
//             };
//         },
//         schema,
//         dataSources: getDataSources,
//         introspection: true,
//         playground: true,
//     });

// 	const handler = server.createHandler({ cors: { credentials: true, origin: '*' } });
// 	const response = await runHandler(event, context, handler);

// 	logger.close();

// 	return response;
// };

// exports.handler = run;
// ----- //

// ----- //
// const middy = require('middy');
// const { cors } = require('middy/middlewares');

// // eslint-disable-next-line require-await
// const createHandler = async () => {
//     const server = new ApolloServer({
//         schema,
//         dataSources,
//         context,
//     });

//     return Promise.resolve(server.createHandler());
// };

// exports.graphqlHandler = middy((event, context, callback) => {
//     // eslint-disable-next-line no-param-reassign
//     context.callbackWaitsForEmptyEventLoop = false;
//     createHandler().then(handler => handler(event, context, callback));
// }).use(cors());
// ----- //
