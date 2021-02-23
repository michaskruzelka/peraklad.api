import { subtitlesService } from '../../../../services/subtitles';
import { ISubCategory } from '../types';
import { MovieSubtitlesSearchParams, SearchResult } from './types';

class Movie implements ISubCategory {
    public async searchForFiles(
        searchParams: MovieSubtitlesSearchParams,
        limit: number = 5
    ): Promise<SearchResult> {
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
                    format: String(fileInfo.format).toLowerCase(),
                    language: fileInfo.langcode.toLowerCase(),
                    encoding: fileInfo.encoding,
                })),
        };
    }
}

export { Movie };
