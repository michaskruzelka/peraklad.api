import { Config } from 'apollo-server-core';
import { Neo4jContext } from 'neo4j-graphql-js';
import { getDataSources } from '../../datasources';
import { logger, neo4j } from '../../services';
import { getSchema } from './schema';
import { validationRules } from './validation';

const getConfig = async (): Promise<Config> => ({
    context: ({ req }: Neo4jContext) => {
        return {
            req,
            driver: neo4j.driver,
            neo4jDatabase: process.env.NEO4J_DATABASE,
            logger: logger.getLogger(),
        };
    },
    schema: await getSchema(),
    dataSources: getDataSources,
    introspection: true,
    playground: true,
    validationRules,
    debug: ['dev', 'development'].includes(String(process.env.NODE_ENV)),
});

export { getConfig };
