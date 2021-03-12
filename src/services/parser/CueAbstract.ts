import {
    parse,
    stringify,
    map,
    Node,
    NodeCue,
    stringifySync,
    Format,
} from 'subtitle';

import {
    filterNodeStream,
    mapElementStream,
    promisifyElementsStream,
    createReadableFromString,
    createReadableFromElements,
    formatText,
    promisifyStringStream,
} from './utils';
import { IElement, ISubtitleElementContext } from './types';
import { TRANSLATION_TEMPLATE, NUMBER_TEMPLATE } from './config';

abstract class CueAbstract {
    protected abstract stringifyFormat: Format;

    public parse(contents: string): Promise<IElement[]> {
        const stream = createReadableFromString([contents])
            .pipe(parse())
            .on('error', () => {})
            .pipe(filterNodeStream(this.isCueNode))
            .pipe(map((node: Node) => this.cueToElement(node as NodeCue)));

        return promisifyElementsStream(stream);
    }

    public format(elements: IElement[]): Promise<string> {
        const stream = createReadableFromElements(elements)
            .pipe(mapElementStream(this.elementToCue))
            .pipe(stringify({ format: this.stringifyFormat }));

        return promisifyStringStream(stream);
    }

    public formatElementTemplate(element: IElement): string {
        const elementToProcess = { ...element, text: TRANSLATION_TEMPLATE };
        const nodes = [this.elementToCue(elementToProcess)];
        const template = stringifySync(nodes, { format: this.stringifyFormat });

        return template.replace('1\n', `${NUMBER_TEMPLATE}\n`);
    }

    private isCueNode(node: Node): boolean {
        return node.type === 'cue';
    }

    private cueToElement(node: NodeCue): IElement {
        return {
            text: formatText(node.data.text),
            context: {
                timing: {
                    startsAt: node.data.start,
                    endsAt: node.data.end,
                },
            },
        };
    }

    private elementToCue(element: IElement): NodeCue {
        return {
            type: 'cue',
            data: {
                text: element.text,
                start: (element.context as ISubtitleElementContext).timing
                    .startsAt,
                end: (element.context as ISubtitleElementContext).timing.endsAt,
            },
        };
    }
}

export { CueAbstract };
