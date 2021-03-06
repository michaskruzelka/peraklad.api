import { Config } from 'apollo-server-core';
import { Neo4jContext } from 'neo4j-graphql-js';
import { getDataSources } from '../../datasources';
import { logger, neo4j } from '../../services';
import { getSchema } from './schema';
import { validationRules } from './validation';
import { authorize } from '../auth';

const getConfig = async (): Promise<Config> => ({
    context: ({ req }: Neo4jContext) => {
        if (req.body.operationName === 'IntrospectionQuery') {
            return { req };
        }

        const { abc, spelling } = authorize(req.headers.authorization || '');

        return {
            req,
            driver: neo4j.driver,
            neo4jDatabase: process.env.NEO4J_DATABASE,
            logger: logger.getLogger(),
            abc,
            spelling,
        };
    },
    schema: await getSchema(),
    dataSources: await getDataSources(),
    introspection: true,
    playground: true,
    validationRules,
    debug: ['dev', 'development'].includes(String(process.env.NODE_ENV)),
    uploads: {
        maxFileSize: 2097152,
        maxFiles: 1,
    },
});

export { getConfig };
