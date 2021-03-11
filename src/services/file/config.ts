import { IFileSignature } from './types';

const DEFAULT_CHARSET = 'utf-8';

const FILE_SIGNATURES: IFileSignature[] = [
    {
        extension: '.srt',
        headers: [
            [0x31, 0x0a, 0x30, 0x30],
            [0x31, 0x0d, 0x0a, 0x30, 0x30],
        ],
    },
    {
        extension: '.vtt',
        headers: [[0x57, 0x45, 0x42, 0x56]],
    },
    {
        extension: '.smi',
        headers: [[0x3c, 0x53, 0x41, 0x4d]],
    },
    {
        extension: '.sbv',
        headers: [
            [0x46, 0x45, 0x44, 0x46],
            [0x30, 0x3a, 0x30, 0x30],
        ],
    },
];

export { DEFAULT_CHARSET, FILE_SIGNATURES };
