import { parse, map, Node, NodeCue } from 'subtitle';

import {
    filterStream,
    promisifyStream,
    createStream,
    formatText,
} from './utils';
import { IElement, IParser } from './types';

class SRT implements IParser {
    private static instance: SRT;
    
    public static getInstance(): SRT {
        if (!this.instance) {
            this.instance = new SRT();
        }

        return this.instance;
    }
    
    public parse(contents: string): Promise<IElement[]> {
        const stream = createStream(contents)
            .pipe(parse())
            .pipe(filterStream(this.isCueNode))
            .pipe(map((node: Node) => this.cueToElement(node as NodeCue)));

        return promisifyStream(stream);
    }

    public format(_elements: IElement[]): string {
        // const cues = elements.map(this.elementToCue);

        // return stringify();
        return '';
    }

    public formatElement(_element: IElement): string {
        return '';
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

    // private elementToCue(_element: IElement): string {
    //     return '';
    // }
}

export default SRT;
