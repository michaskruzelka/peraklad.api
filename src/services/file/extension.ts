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

const allocateBuffer = (buffer: Buffer): Buffer => {
    const from =
        buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf
            ? buffer.slice(3)
            : buffer;

    const allocatedBuffer = Buffer.alloc(8);

    return allocatedBuffer.fill(0).fill(Buffer.from(from));
};

const retrieveFromBuffer = (buffer: Buffer): string | undefined => {
    const allocatedBuffer = allocateBuffer(buffer);

    for (const fileSignature of FILE_SIGNATURES) {
        for (const headers of fileSignature.headers) {
            if (check(allocatedBuffer, headers)) {
                return fileSignature.extension;
            }
        }
    }

    return;
};

export { retrieveFromBuffer };
