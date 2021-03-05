import { Service } from './types';
import { SUBTITLES_SERVICES } from './config';

const getService = (filter: (service: Service) => boolean): Service => {
    const service = SUBTITLES_SERVICES.find(filter);
    
    if (!service) {
        throw new Error('Subtitles service not found.');
    }

    return service;
};

export { getService };
