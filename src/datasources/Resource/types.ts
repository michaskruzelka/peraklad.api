import { ILanguage } from '../Language/types';
import { Category, IProject, SubCategory } from '../Project/types';

enum FileFormatCode {
    SRT = 'srt',
    VTT = 'vtt',
    SMI = 'smi',
    SBV = 'sbv',
    JSON = 'json',
    YML = 'yml',
    XLIFF = 'xliff',
}

enum StatusID {
    STARTED = 1,
    FINISHED = 2,
    DELETED = 3,
}

enum StatusCode {
    STARTED = 'started',
    FINISHED = 'finished',
    DELETED = 'deleted',
}

type Status = {
    id: StatusID;
    code: StatusCode;
};

type FileFormat = {
    code: FileFormatCode;
    extensions: string[];
    name: string;
    longName?: string;
    description?: string | null;
};

type SubtitlesFileFormats = {
    [SubCategory.MOVIE]: FileFormat[];
    [SubCategory.VIDEO_STREAM]: FileFormat[];
};

type CategoryFileFormats = {
    [Category.SUBTITLES]: SubtitlesFileFormats;
    [Category.SOFTWARE]: FileFormat[];
};

type FileFormatsArgs = {
    category: Category;
    subCategory?: SubCategory | null;
};

interface IResource {
    id: string;
    name: string;
    format: FileFormat & {
        code: {
            _code: FileFormatCode;
            _labels: string[];
        };
    };
    language: {
        code: string;
    };
    status: {
        id: number;
    };
    project: IProject;
}

type ResolvedResource = IResource & {
    format: FileFormat;
    language: ILanguage;
    status: Status;
};

interface IDataSource {
    getFileFormats(category: Category, subCategory?: SubCategory): FileFormat[];
    getFileFormatByCode(
        code: string,
        category: Category,
        subCategory?: SubCategory | null
    ): FileFormat;
    getStatusById(id: number): Status;
}

export {
    FileFormat,
    FileFormatCode,
    CategoryFileFormats,
    IDataSource,
    SubtitlesFileFormats,
    FileFormatsArgs,
    Status,
    StatusID,
    StatusCode,
    IResource,
    ResolvedResource,
};
