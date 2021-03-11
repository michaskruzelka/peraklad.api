import subsrt from 'subsrt';

import { EOL } from './config';
import { IElement, ICaption, ISubtitleElementContext } from './types';
import {
    createReadableFromElements,
    mapElementStream,
    promisifyElementsStream,
    promisifyStringStream,
    filterNodeStream,
    createReadableFromString,
} from './utils';

abstract class CaptionAbstract {
    protected abstract stringifyFormat: string;

    public parse(contents: string): Promise<IElement[]> {
        const nodes = subsrt.parse(contents, {
            format: this.stringifyFormat,
            eol: EOL,
            verbose: true,
        });

        const stream = createReadableFromElements(nodes)
            .pipe(filterNodeStream(this.isCaptionNode))
            .pipe(mapElementStream(this.captionToElement));

        return promisifyElementsStream(stream);
    }

    public format(elements: IElement[], options?: any): Promise<string> {
        const nodes = elements.map(this.elementToCaption);
        const result = subsrt.build(nodes, {
            format: this.stringifyFormat,
            eol: EOL,
            closeTags: true,
            ...(options || {}),
        });
        const stream = createReadableFromString([result]);

        return promisifyStringStream(stream);
    }

    public formatElementTemplate(element: IElement, options?: any): string {
        const node = this.elementToCaption(element);
        const template = subsrt.build([node], {
            format: this.stringifyFormat,
            eol: EOL,
            closeTags: true,
            ...(options || {}),
        });

        return template;
    }

    protected isCaptionNode(node: any): boolean {
        return node.type && node.type === 'caption';
    }

    protected captionToElement(resultItem: ICaption): IElement {
        return {
            text: resultItem.text,
            context: {
                timing: {
                    startsAt: resultItem.start,
                    endsAt: resultItem.end,
                },
            },
        };
    }

    protected elementToCaption(element: IElement): ICaption {
        return {
            type: 'caption',
            text: element.text,
            start: (element.context as ISubtitleElementContext).timing.startsAt,
            end: (element.context as ISubtitleElementContext).timing.endsAt,
        };
    }
}

export { CaptionAbstract };
