import { Category, SubCategory } from '../Project/types';
import {
    FileFormat,
    FileFormatCode,
    CategoryFileFormats,
    Status,
    StatusID,
    StatusCode,
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
} from './types';
import SRT from '../../services/parser/SRT';

const SRT_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.SRT,
    name: 'SRT',
    longName: 'SubRip',
    extensions: ['.srt'],
    parser: () => {
        return new SRT();
    },
};

const VTT_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.VTT,
    name: 'WebVTT',
    longName: 'Web Video Text Tracks',
    extensions: ['.vtt'],
    parser: () => {
        return new SRT(); // to change
    },
};

const SBV_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.SBV,
    name: 'SBV',
    longName: 'Youtube Captions',
    extensions: ['.sbv'],
    parser: () => {
        return new SRT(); // to change
    },
};

const SMI_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.SMI,
    name: 'SAMI',
    longName: 'Synchronized Accessible Media Interchange',
    extensions: ['.smi', '.sami'],
    parser: () => {
        return new SRT(); // to change
    },
};

const JSON_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.JSON,
    name: 'JSON',
    extensions: ['.json'],
    parser: () => {
        return new SRT(); // to change
    },
};

const YML_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.YML,
    name: 'YAML',
    extensions: ['.yaml', '.yml'],
    parser: () => {
        return new SRT(); // to change
    },
};

const XLIFF_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.XLIFF,
    name: 'XLIFF',
    longName: 'XML Localization Interchange File Format',
    extensions: ['.xlf'],
    parser: () => {
        return new SRT(); // to change
    },
};

const FILE_FORMATS: CategoryFileFormats = {
    [Category.SUBTITLES]: {
        [SubCategory.MOVIE]: [
            SRT_FILE_FORMAT,
            VTT_FILE_FORMAT,
            SMI_FILE_FORMAT,
        ],
        [SubCategory.VIDEO_STREAM]: [
            SBV_FILE_FORMAT,
            SRT_FILE_FORMAT,
            VTT_FILE_FORMAT,
        ],
    },
    [Category.SOFTWARE]: [JSON_FILE_FORMAT, YML_FILE_FORMAT, XLIFF_FILE_FORMAT],
};

const STATUSES: Status[] = [
    {
        id: StatusID.STARTED,
        code: StatusCode.STARTED,
        name: StatusCode.STARTED,
    },
    {
        id: StatusID.FINISHED,
        code: StatusCode.FINISHED,
        name: StatusCode.FINISHED,
    },
    {
        id: StatusID.DELETED,
        code: StatusCode.DELETED,
        name: StatusCode.DELETED,
    },
];

const ITEM_STATUSES: ItemStatus[] = [
    {
        id: ItemStatusID.NEW,
        code: ItemStatusCode.NEW,
        name: ItemStatusCode.NEW,
    },
    {
        id: ItemStatusID.TRANSLATING,
        code: ItemStatusCode.TRANSLATING,
        name: ItemStatusCode.TRANSLATING,
    },
    {
        id: ItemStatusID.TRANSLATED,
        code: ItemStatusCode.TRANSLATED,
        name: ItemStatusCode.TRANSLATED,
    },
];

const TRANSLATION_STATUSES: TranslationStatus[] = [
    {
        id: TranslationStatusID.SUGGESTED,
        code: TranslationStatusCode.SUGGESTED,
    },
    {
        id: TranslationStatusID.APPROVED,
        code: TranslationStatusCode.APPROVED,
    },
];

const TRANSLATION_TYPES: TranslationType[] = [
    {
        id: TranslationTypeID.HUMAN,
        code: TranslationTypeCode.HUMAN,
    },
    {
        id: TranslationTypeID.MACHINE,
        code: TranslationTypeCode.MACHINE,
    },
];

const TRANSLATION_SERVICES: TranslationService[] = [
    {
        id: TranslationServiceID.GOOGLE,
        code: TranslationServiceCode.GOOGLE,
        name: 'Google Перакладчык',
    },
    {
        id: TranslationServiceID.YANDEX,
        code: TranslationServiceCode.YANDEX,
        name: 'Yandex Перакладчык',
    },
];

export {
    FILE_FORMATS,
    STATUSES,
    ITEM_STATUSES,
    TRANSLATION_STATUSES,
    TRANSLATION_TYPES,
    TRANSLATION_SERVICES,
};
