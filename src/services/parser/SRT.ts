import { Format } from 'subtitle';

import { SRTVTTAbstract } from './SRTVTTAbstract';
import { IParser } from './types';

class SRT extends SRTVTTAbstract implements IParser {
    private static instance: SRT;
    protected stringifyFormat: Format = 'SRT';

    public static getInstance(): SRT {
        if (!this.instance) {
            this.instance = new SRT();
        }

        return this.instance;
    }
}

export default SRT;
