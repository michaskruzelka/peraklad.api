import { Driver, Record } from 'neo4j-driver';
import { Logger } from 'winston';

const request = {
    perform: async (
        cql: string,
        params: object,
        driver: Driver,
        logger: Logger
    ): Promise<Record[]> => {
        let result;
        const session = driver.session();

        try {
            result = await session.run(cql, params);
        } catch (e) {
            // console.log(e.message);
            logger.log('error', `DB query: ${e.message}`);
            throw new Error('Could not perform a request to DB.');
        } finally {
            await session.close();
        }

        return result.records;
    },
    performWriteTransaction: async (
        queries: { cql: string; params: object }[],
        driver: Driver,
        logger: Logger
    ): Promise<Promise<Record[]>[]> => {
        let results;
        const session = driver.session();
        try {
            results = await session.writeTransaction((tx) => {
                return queries.map((query) => {
                    return tx.run(query.cql, query.params);
                });
            });

            results = results.map(async (res) => (await res).records);
        } catch (e) {
            // console.log(e.message);
            logger.log('error', `DB write transaction: ${e.message}`);
            throw new Error('Could not perform a transaction against DB.');
        } finally {
            await session.close();
        }

        return results;
    },
};

export default request;
