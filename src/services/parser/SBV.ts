import subsrt from 'subsrt';

import { ICaption, IParser, IElement } from './types';
import { CaptionAbstract } from './CaptionAbstract';
import { EOL } from './config';
import {
    createReadableFromElements,
    mapElementStream,
    promisifyElementsStream,
} from './utils';

class SBV extends CaptionAbstract implements IParser {
    private static instance: SBV;
    protected stringifyFormat: string = 'sbv';
    private pattern = /^(\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?)\s*[,;]\s*(\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?)\r?\n([\s\S]*)(\r?\n)*$/gi;

    public static getInstance(): SBV {
        if (!this.instance) {
            this.instance = new SBV();
        }

        return this.instance;
    }

    public parse(contents: string): Promise<IElement[]> {
        const nodes = this.getCaptions(contents);

        const stream = createReadableFromElements(nodes)
            .pipe(mapElementStream(this.captionToElement));

        return promisifyElementsStream(stream);
    }

    private getCaptions(contents: string): ICaption[] {
        const captions = [];
        const parts = contents.split(/\r?\n\s*\r?\n/);

        for (const part of parts) {
            const match = this.pattern.exec(part.trim());
            if (match) {
                const caption: ICaption = {
                    type: 'caption',
                    start: subsrt.format['sbv'].helper.toMilliseconds(match[1]),
                    end: subsrt.format['sbv'].helper.toMilliseconds(match[3]),
                    text: match[5].split(/\[br\]|\r?\n/gi).join(EOL),
                };
                captions.push(caption);
                continue;
            }

            // console.log('WARN: Unknown part', part);
        }

        return captions;
    }
}

export default SBV;
