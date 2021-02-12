import winston from 'winston';
import LogzioWinstonTransport from 'winston-logzio';

const getLogger = () => {
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
    
    return logger;
};

winston.remove(winston.transports.Console);

export { getLogger };
