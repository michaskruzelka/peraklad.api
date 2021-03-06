import { IFileSignature } from './types';

const DEFAULT_CHARSET = 'utf-8';

const FILE_SIGNATURES: IFileSignature[] = [
    {
        extension: '.srt',
        headers: [0x31, 0x0a, 0x30, 0x30],
    },
    {
        extension: '.sbv',
        headers: [0x46, 0x45, 0x44, 0x46],
    },
];

export { DEFAULT_CHARSET, FILE_SIGNATURES };
