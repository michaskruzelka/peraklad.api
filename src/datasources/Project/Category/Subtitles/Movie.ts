import { FileFormatCode } from '../../../Resource/types';
import { ServicesCodes } from '../../../../services/subtitles/types';
import { getService } from '../../../../services/subtitles';
import { ISubCategory } from '../types';
import { MovieSubtitlesSearchParams, SearchResult } from './types';

class Movie implements ISubCategory {
    public async searchForFiles(
        searchParams: MovieSubtitlesSearchParams,
        limit: number = 5,
        service: ServicesCodes | null = ServicesCodes.OS
    ): Promise<SearchResult> {
        const subtitlesService = getService(service || ServicesCodes.OS);
        const result = await subtitlesService.search(searchParams, limit);

        return {
            service: {
                code: subtitlesService.code,
                name: subtitlesService.name,
            },
            filesInfo: Object.values(result)
                .flat(1)
                .map((fileInfo: any) => ({
                    url: fileInfo.url,
                    fileName: fileInfo.filename,
                    format: fileInfo.format
                        ? String(fileInfo.format).toLowerCase()
                        : FileFormatCode.SRT,
                    languageCode: fileInfo.langcode
                        ? fileInfo.langcode.toLowerCase()
                        : undefined,
                    languageName: fileInfo.language,
                    encoding: fileInfo.encoding,
                })),
        };
    }

    public getServiceById(id: number) {
        console.log(id);
        throw new Error('Method getServiceById is not implemented.');
    }
}

export { Movie };
