import { ICategory, ISubCategory } from './types';

class Subtitles implements ICategory {
    public readonly subCategory: ISubCategory;

    constructor(subCategory: ISubCategory) {
        this.subCategory = subCategory;
    }

    public async readRemoteFile(
        fileUrl: string
    ): Promise<Buffer> {
        const fileUrlInfo = new URL(fileUrl);
        const subtitlesService = this.subCategory.getSubtitlesService(
            (service) => service.downloadDomains.includes(fileUrlInfo.hostname)
        );

        return subtitlesService.download(fileUrl);
    }
}

export { Subtitles };
