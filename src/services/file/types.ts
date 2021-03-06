enum FileFormatCode {
    SRT = 'srt',
    VTT = 'vtt',
    SMI = 'smi',
    SBV = 'sbv',
    JSON = 'json',
    YML = 'yml',
    XLIFF = 'xliff',
}

interface IFileSignature {
    extension: string;
    headers: number[];
}

interface IFileContents {
    contents: string;
    extension?: string | undefined;
}

export { FileFormatCode, IFileContents, IFileSignature };
