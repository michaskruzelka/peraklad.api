import { Format } from 'subtitle';

import { CueAbstract } from './CueAbstract';
import { IParser } from './types';

class SRT extends CueAbstract implements IParser {
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
