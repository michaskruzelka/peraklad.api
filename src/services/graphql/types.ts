import { Driver } from 'neo4j-driver';
import { Logger } from 'winston';

interface IContext {
    driver: Driver;
    logger: Logger;
}

export { IContext };
