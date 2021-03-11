import { Format } from 'subtitle';

import { SRTVTTAbstract } from './SRTVTTAbstract';
import { IParser, IElement } from './types';

class VTT extends SRTVTTAbstract implements IParser {
    private static instance: VTT;
    protected stringifyFormat: Format = 'WebVTT';

    public static getInstance(): VTT {
        if (!this.instance) {
            this.instance = new VTT();
        }

        return this.instance;
    }

    public formatElementTemplate(element: IElement): string {
        const template = super.formatElementTemplate(element);

        return template.replace('WEBVTT\n\n', '');
    }
}

export default VTT;
