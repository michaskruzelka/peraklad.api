import { subtitlesService } from '../../../../services/subtitles';
import { ISubCategory } from '../types';
import { OfflineSearchParams, SearchResult } from './types';

class Offline implements ISubCategory {
    public async searchForFiles(
        searchParams: OfflineSearchParams,
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
                    language: fileInfo.langcode,
                    encoding: fileInfo.encoding,
                })),
        };
    }
}

export { Offline };
