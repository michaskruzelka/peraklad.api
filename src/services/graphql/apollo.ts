import { Config } from 'apollo-server-core';
import { Neo4jContext } from 'neo4j-graphql-js';
import { getDataSources } from '../../datasources';
import { logger, neo4j } from '../../services';
import { schema } from './schema';
import { validationRules } from './validation';

const config: Config = {
    context: ({ req }: Neo4jContext) => {
        return {
            req,
            driver: neo4j.driver,
            neo4jDatabase: process.env.NEO4J_DATABASE,
            logger: logger.getLogger(),
        };
    },
    schema,
    dataSources: getDataSources,
    introspection: true,
    playground: true,
    validationRules,
    debug: ['dev', 'development'].includes(String(process.env.NODE_ENV)),
};

export { config };
