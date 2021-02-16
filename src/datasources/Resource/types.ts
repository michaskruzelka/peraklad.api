import { Category, SubtitlesSubcategory } from '../Project/types';

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
    [SubtitlesSubcategory.OFFLINE]: FileFormat[];
    [SubtitlesSubcategory.ONLINE]: FileFormat[];
};

type CategoryFileFormats = {
    [Category.SUBTITLES]: SubtitlesFileFormats;
    [Category.SOFTWARE]: FileFormat[];
};

type FileFormatsArgs = {
    category: Category;
    subcategory?: SubtitlesSubcategory | null;
};

type FileFormatsResponse = FileFormat[];

interface IDataSource {
    getFileFormats(
        category: Category,
        subCategory?: SubtitlesSubcategory
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
