import { Transform, Readable } from 'stream';

import { IElement } from './types';
import { DEFAULT_CHARSET } from '../file/config';

const createStream = (contents: Iterable<any>): Readable => {
    return Readable.from(contents, { encoding: DEFAULT_CHARSET });
};

const mapElementStream = (mapper: (element: IElement, index: number) => any) => {
  let index = 0

  return new Transform({
    objectMode: true,
    autoDestroy: false,
    transform(chunk: IElement, _encoding, callback) {
      callback(null, mapper(chunk, index++))
    }
  })
}

const filterNodeStream = (fn: any) =>
    new Transform({
        objectMode: true,
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
const promisifyElementsStream = (stream: Readable): Promise<IElement[]> => {
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

const promisifyStringStream = async (stream: Readable): Promise<string> => {
    let result = '';

    for await (const chunk of stream) {
        result += chunk;
    }

    return result;
};

const formatText = (text: string): string => {
    return text.replace(/(<([^>]+)>)/gi, '').trim();
};

export {
    filterNodeStream,
    mapElementStream,
    promisifyElementsStream,
    promisifyStringStream,
    createStream,
    formatText,
};
