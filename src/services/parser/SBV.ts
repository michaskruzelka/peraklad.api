import subsrt from 'subsrt';
import { Readable } from 'stream';

import { ICaption, IParser, IElement } from './types';
import { CaptionAbstract } from './CaptionAbstract';
import { EOL, TRANSLATION_TEMPLATE } from './config';
import {
    createReadableFromElements,
    mapElementStream,
    promisifyElementsStream,
    promisifyStringStream,
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
        const stream = this.createCaptionsStream(contents).pipe(
            mapElementStream(this.captionToElement)
        );

        return promisifyElementsStream(stream);
    }

    public format(elements: IElement[]): Promise<string> {
        const stream = createReadableFromElements(elements).pipe(
            mapElementStream(this.formatElement)
        );

        return promisifyStringStream(stream);
    }

    public formatElementTemplate(element: IElement): string {
        const caption = this.elementToCaption(element);
        const formattedStart = subsrt.format['sbv'].helper.toTimeString(
            caption.start
        );
        const formattedEnd = subsrt.format['sbv'].helper.toTimeString(
            caption.end
        );

        let template = `${formattedStart},${formattedEnd}${EOL}`;
        template += TRANSLATION_TEMPLATE + EOL;

        return template;
    }

    private formatElement(element: IElement): string {
        return this.formatElementTemplate(element).replace(
            TRANSLATION_TEMPLATE,
            element.text
        );
    }

    private createCaptionsStream(contents: string): Readable {
        const stream = createReadableFromElements([]);
        const parts = contents.split(/\r?\n\s*\r?\n/);

        for (const part of parts) {
            this.pattern.lastIndex = 0;
            const match = this.pattern.exec(part.trim());
            if (match) {
                const caption: ICaption = {
                    type: 'caption',
                    start: subsrt.format['sbv'].helper.toMilliseconds(match[1]),
                    end: subsrt.format['sbv'].helper.toMilliseconds(match[3]),
                    text: match[5].split(/\[br\]|\r?\n/gi).join(EOL),
                };
                stream.push(caption);
            }
        }

        return stream;
    }
}

export default SBV;
