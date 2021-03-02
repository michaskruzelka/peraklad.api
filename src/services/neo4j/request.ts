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
            logger.log('error', `createIMDBMovieProject: ${e.message}`);
            throw new Error('Could not perform a request to DB.');
        } finally {
            session.close();
        }
        
        return result.records;
    },
};

export default request;
