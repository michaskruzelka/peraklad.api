import { parse, stringify, map, Node, NodeCue } from 'subtitle';

import {
    filterNodeStream,
    mapElementStream,
    promisifyElementsStream,
    createStream,
    formatText,
    promisifyStringStream,
} from './utils';
import { IElement, IParser, ISubtitleElementContext } from './types';

class SRT implements IParser {
    private static instance: SRT;
    
    public static getInstance(): SRT {
        if (!this.instance) {
            this.instance = new SRT();
        }

        return this.instance;
    }
    
    public parse(contents: string): Promise<IElement[]> {
        const stream = createStream([contents])
            .pipe(parse())
            .pipe(filterNodeStream(this.isCueNode))
            .pipe(map((node: Node) => this.cueToElement(node as NodeCue)));

        return promisifyElementsStream(stream);
    }

    public format(elements: IElement[]): Promise<string> {
        const stream = createStream(elements)
            .pipe(mapElementStream(this.elementToCue))
            .pipe(stringify({ format: 'SRT' }))

        return promisifyStringStream(stream);
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
                start: (element.context as ISubtitleElementContext).timing.startsAt,
                end: (element.context as ISubtitleElementContext).timing.endsAt
            }
        }
    }
}

export default SRT;
