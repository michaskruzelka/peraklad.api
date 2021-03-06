import { Transform, Readable } from 'stream';

import { IElement } from './types';
import { DEFAULT_CHARSET } from '../file/config';

const createStream = (contents: string): Readable => {
    return Readable.from([contents], { encoding: DEFAULT_CHARSET });
}

const filterStream = (fn: any, options = {}) =>
    new Transform({
        objectMode: true,
        ...options,

        transform(chunk, _encoding, callback) {
            let take;

            try {
                take = fn(chunk);
            } catch (e) {
                return callback(e);
            }

            return callback(null, take ? chunk : undefined);
        },
    });

/*
    I found 3 options how to promisify stream into a list of IElements:
        1) Easy but requires 'await' immediately
            const chunks = [];
            for await (let chunk of stream) {
                chunks.push(chunk);
            }
            return chunks;
        2) Super easy but requires a package
            import getStream from 'get-stream';
            return getStream.array(stream);
        3) see below:
    
*/
const promisifyStream = (stream: Readable): Promise<IElement[]> => {
    return new Promise((resolve, reject) => {
        const chunks: IElement[] = [];

        stream.on('data', function (chunk: IElement) {
            chunks.push(chunk);
        });
        stream.on('end', function () {
            resolve(chunks);
        });
        stream.on('error', function (err) {
            reject(err);
        });
    });
};

export { filterStream, promisifyStream, createStream };
