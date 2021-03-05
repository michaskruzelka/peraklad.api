import { StreamService } from '../../../../services/subtitles/types';
import { STREAM_SERVICES } from '../../../../services/subtitles/config';
import { ISubCategory, SearchParams } from '../types';

class VideoStream implements ISubCategory {
    public async searchForFiles(
        _: SearchParams,
        __: number = 5
    ): Promise<any> {
        throw new Error('Method searchForFiles is not implemented.');
    }

    public getServiceById(id: number): StreamService {
        const service = STREAM_SERVICES.find(
            (streaService) => streaService.id === id
        );

        if (!service) {
            throw new Error('Video stream service not found.');
        }

        return service;
    }
}

export { VideoStream };
