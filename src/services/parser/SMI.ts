import samiParser from 'sami-parser';

import { IParser, IElement, ISMINode } from './types';
import {
    createReadableFromElements,
    mapElementStream,
    promisifyElementsStream,
} from './utils';

class SMI implements IParser {
    private static instance: SMI;

    public static getInstance(): SMI {
        if (!this.instance) {
            this.instance = new SMI();
        }

        return this.instance;
    }

    public parse(contents: string): Promise<IElement[]> {
        const parseTree = samiParser.parse(contents);

        if (parseTree.errors?.length > 0) {
            throw new Error('Could not parse SAMI file.');
        }

        const stream = createReadableFromElements(parseTree.result).pipe(
            mapElementStream(this.resultItemToElement)
        );

        return promisifyElementsStream(stream);
    }

    public format(_elements: IElement[]): Promise<string> {
        return new Promise(() => {
            return '';
        });
    }

    public formatElementTemplate(_element: IElement): string {
        // const parsedElement = samiParser.parse(contents);

        return '';
    }

    private resultItemToElement(resultItem: ISMINode): IElement {
        return {
            text: Object.values(resultItem.languages)[0],
            context: {
                timing: {
                    startsAt: resultItem.startTime,
                    endsAt: resultItem.endTime,
                },
            },
        };
    }
}

export default SMI;
