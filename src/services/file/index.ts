import jschardet from 'jschardet';
import iconv from 'iconv-lite';

import { DEFAULT_CHARSET } from './config';
import { IFileContents } from './types';
import { retrieveFromBuffer } from './extension';

const bufferToString = (buffer: Buffer, encoding?: string): string => {
    const charset = (
        jschardet.detect(buffer, { minimumThreshold: 0.5 }).encoding ||
        encoding ||
        DEFAULT_CHARSET
    ).toLowerCase();

    const contents =
        DEFAULT_CHARSET === charset
            ? buffer.toString(charset)
            : iconv.decode(buffer, charset);

    return contents;
};

const getFileContents = (buffer: Buffer, encoding?: string): IFileContents => {
    return {
        contents: bufferToString(buffer, encoding),
        extension: retrieveFromBuffer(buffer),
    };
};

const getFileNameWithNoExt = (fileName: string): string => {
    const commaPosition = fileName.lastIndexOf('.');

    return fileName.substr(0, commaPosition);
};

const getFileExt = (fileName: string): string => {
    const commaPosition = fileName.lastIndexOf('.');

    return fileName.substr(commaPosition);
};

export { getFileContents, getFileNameWithNoExt, getFileExt };
