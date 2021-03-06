import { FileUpload } from 'graphql-upload';

import { ILanguage } from '../Language/types';
import { Category, IProject, SubCategory } from '../Project/types';
import { FileFormatCode } from '../../services/file/types';
import { IParser } from '../../services/parser/types';

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
    name: string;
};

type FileFormat = {
    code: FileFormatCode;
    extensions: string[];
    name: string;
    longName?: string;
    description?: string | null;
    parser: () => IParser;
};

type SubtitlesFileFormats = {
    [SubCategory.MOVIE]: FileFormat[];
    [SubCategory.VIDEO_STREAM]: FileFormat[];
};

type CategoryFileFormats = {
    [Category.SUBTITLES]: SubtitlesFileFormats;
    [Category.SOFTWARE]: FileFormat[];
};

enum ItemContextLabel {
    SOFTWARE_ELEMENT = 'SoftwareElement',
    SUBTITLE = 'Subtitle',
}

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

enum TranslationStatusID {
    SUGGESTED = 1,
    APPROVED = 2,
}

enum TranslationStatusCode {
    SUGGESTED = 'suggested',
    APPROVED = 'approved',
}

type TranslationStatus = {
    id: TranslationStatusID;
    code: TranslationStatusCode;
};

enum TranslationTypeID {
    HUMAN = 1,
    MACHINE = 2,
}

enum TranslationTypeCode {
    HUMAN = 'human',
    MACHINE = 'machine',
}

type TranslationType = {
    id: TranslationTypeID;
    code: TranslationTypeCode;
};

enum TranslationServiceID {
    GOOGLE = 1,
    YANDEX = 2,
}

enum TranslationServiceCode {
    GOOGLE = 'google',
    YANDEX = 'yandex',
}

type TranslationService = {
    id: TranslationServiceID;
    code: TranslationServiceCode;
    name: string;
};

interface ITranslation {
    id: string;
    text: string;
    status: {
        id?: number | null;
    };
    type: {
        id?: number | null;
    };
    service?: {
        id?: number | null;
    };
}

type ResolvedTranslation = ITranslation & {
    status: TranslationStatus;
    type: TranslationType;
    service?: TranslationService;
};

interface IRecommendation {
    language: { code?: string | null };
    text: string;
}

type ResolvedRecommendation = IRecommendation & {
    language: ILanguage;
};

enum ItemStatusID {
    NEW = 1,
    TRANSLATING = 2,
    TRANSLATED = 3,
}

enum ItemStatusCode {
    NEW = 'new',
    TRANSLATING = 'translating',
    TRANSLATED = 'translated',
}

type ItemStatus = {
    id: ItemStatusID;
    code: ItemStatusCode;
    name: ItemStatusCode;
};

interface IResourceItem {
    id: string;
    text: string;
    status: {
        id?: number | null;
    };
}

type ResolvedResourceItem = IResourceItem & {
    status: ItemStatus;
};

interface IDuration {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    total: number;
    formatted?: string;
}

type TimingFormat = {
    text: {
        labels: string[];
        startsAt: IDuration;
        endsAt: IDuration;
    };
    fileFormat: FileFormat;
};

type ResolvedTimingFormat = TimingFormat & {
    text: string;
};

interface ITiming {
    formatted: TimingFormat[];
}

type ImportOptions = {
    language: ILanguage;
    projectId: string;
    projectCategory: Category;
    fileName: string;
    projectSubCategory?: SubCategory;
    encoding?: string;
    extension?: FileFormatCode;
};

type CreateResourceArgs = {
    projectId: string;
    language: string;
    fileName: string;
    file?: Promise<FileUpload>;
    fileUrl?: string;
    encoding?: string;
};

type CreateTranslationArgs = {
    resourceItemId: string;
    text: string;
    status: TranslationStatusID;
};

type DownloadArgs = {
    resourceId: string;
    fileFormat: string;
    abc: number;
};

interface IDataSource {
    getFileFormats(category: Category, subCategory?: SubCategory): FileFormat[];
    getFileFormatByCode(
        code: string,
        category: Category,
        subCategory?: SubCategory | null
    ): FileFormat;
    getStatusById(id: number): Status;
    getItemStatusById(id: number): ItemStatus;
    getTranslationStatusById(id: number): TranslationStatus;
    getTranslationTypeById(id: number): TranslationType;
    getTranslationServiceById(id: number): TranslationService;
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
    IResourceItem,
    ResolvedResourceItem,
    ItemStatus,
    ItemStatusID,
    ItemStatusCode,
    TranslationStatus,
    TranslationStatusID,
    TranslationStatusCode,
    TranslationType,
    TranslationTypeID,
    TranslationTypeCode,
    TranslationService,
    TranslationServiceID,
    TranslationServiceCode,
    ITranslation,
    ResolvedTranslation,
    IRecommendation,
    ResolvedRecommendation,
    ITiming,
    TimingFormat,
    ResolvedTimingFormat,
    ImportOptions,
    ItemContextLabel,
    CreateResourceArgs,
    CreateTranslationArgs,
    DownloadArgs,
};
