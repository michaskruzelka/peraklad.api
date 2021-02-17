import { Category, SubtitlesSubCategory } from '../Project/types';

enum FileFormatCode {
    SRT = 'srt',
    VTT = 'vtt',
    SMI = 'smi',
    SBV = 'sbv',
    JSON = 'json',
    YML = 'yml',
    XLIFF = 'xliff',
}

type FileFormat = {
    code: FileFormatCode;
    extensions: string[];
    name: string;
    longName?: string;
    description?: string | null;
};

type SubtitlesFileFormats = {
    [SubtitlesSubCategory.OFFLINE]: FileFormat[];
    [SubtitlesSubCategory.ONLINE]: FileFormat[];
};

type CategoryFileFormats = {
    [Category.SUBTITLES]: SubtitlesFileFormats;
    [Category.SOFTWARE]: FileFormat[];
};

type FileFormatsArgs = {
    category: Category;
    subCategory?: SubtitlesSubCategory | null;
};

type FileFormatsResponse = FileFormat[];

interface IDataSource {
    getFileFormats(
        category: Category,
        subCategory?: SubtitlesSubCategory
    ): FileFormat[];
}

export {
    FileFormat,
    FileFormatCode,
    CategoryFileFormats,
    IDataSource,
    SubtitlesFileFormats,
    FileFormatsArgs,
    FileFormatsResponse,
};
