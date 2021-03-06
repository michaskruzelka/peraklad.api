import { FILE_SIGNATURES } from './config';

// const stringToBytes = (string: string) =>
//     [...string].map((character) => character.charCodeAt(0));

const check = (buffer: Buffer, headers: number[]) => {
    for (const [index, header] of headers.entries()) {
        if (header !== buffer[index]) {
            return false;
        }
    }

    return true;
};

const retrieveFromBuffer = (buffer: Buffer): string | undefined => {
    const allocatedBuffer = Buffer.alloc(4).fill(0).fill(buffer);

    for (const fileSignature of FILE_SIGNATURES) {
        if (check(allocatedBuffer, [0x31, 0x0a, 0x30, 0x30])) {
            return fileSignature.extension;
        }
    }

    return;
};

export { retrieveFromBuffer };
