import winston from 'winston';
import LogzioWinstonTransport from 'winston-logzio';

const logzioWinstonTransport = new LogzioWinstonTransport({
    level: 'info',
    name: 'winston_logzio',
    token: process.env.LOGZ_TOKEN as string,
    host: 'listener-eu.logz.io',
    type: 'peraklad.ai: ' + process.env.NODE_ENV,
});

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [logzioWinstonTransport],
});

winston.remove(winston.transports.Console);

export { logger };
