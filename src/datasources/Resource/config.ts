import { Category, SubtitlesSubCategory } from '../Project/types';
import { FileFormat, FileFormatCode, CategoryFileFormats } from './types';

const SRT_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.SRT,
    name: 'SRT',
    longName: 'SubRip',
    extensions: ['.srt'],
};

const VTT_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.VTT,
    name: 'WebVTT',
    longName: 'Web Video Text Tracks',
    extensions: ['.vtt'],
};

const SBV_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.SBV,
    name: 'SBV',
    longName: 'Youtube Captions',
    extensions: ['.sbv'],
};

const SMI_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.SMI,
    name: 'SAMI',
    longName: 'Synchronized Accessible Media Interchange',
    extensions: ['.smi', '.sami'],
};

const JSON_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.JSON,
    name: 'JSON',
    extensions: ['.json'],
};

const YML_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.YML,
    name: 'YAML',
    extensions: ['.yaml', '.yml'],
};

const XLIFF_FILE_FORMAT: FileFormat = {
    code: FileFormatCode.XLIFF,
    name: 'XLIFF',
    longName: 'XML Localization Interchange File Format',
    extensions: ['.xlf'],
};

const FILE_FORMATS: CategoryFileFormats = {
    [Category.SUBTITLES]: {
        [SubtitlesSubCategory.OFFLINE]: [
            SRT_FILE_FORMAT,
            VTT_FILE_FORMAT,
            SMI_FILE_FORMAT,
        ],
        [SubtitlesSubCategory.ONLINE]: [
            SBV_FILE_FORMAT,
            SRT_FILE_FORMAT,
            VTT_FILE_FORMAT,
        ],
    },
    [Category.SOFTWARE]: [JSON_FILE_FORMAT, YML_FILE_FORMAT, XLIFF_FILE_FORMAT],
};

export { FILE_FORMATS };
