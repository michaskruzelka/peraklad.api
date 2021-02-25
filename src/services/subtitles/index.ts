import os from './os';
import yify from './yify';
import { ServicesCodes, Service } from './types';

const getService = (serviceCode: ServicesCodes): Service => {
    if (os.code === serviceCode) {
        return os;
    }

    if (yify.code === serviceCode) {
        return yify;
    }

    throw new Error('Subtitles service not found.');
}

export { getService };
