import { parse, map, Node, NodeCue } from 'subtitle';

import { filterStream, promisifyStream, createStream } from './utils';
import { IElement, IParser } from './types';

class SRT implements IParser {
    public parse(contents: string): Promise<IElement[]> {
        const stream = createStream(contents)
            .pipe(parse())
            .pipe(filterStream(this.isCueNode))
            .pipe(map((node: Node) => this.cueToElement(node as NodeCue)));

        return promisifyStream(stream);
    }

    public format(_elements: IElement[]): string {
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
            // strip tags & trim
            // let strippedString = originalString.replace(/(<([^>]+)>)/gi, "").trim();
            // move the logic to utils
            text: node.data.text,
        };
    }
}

export default SRT;
