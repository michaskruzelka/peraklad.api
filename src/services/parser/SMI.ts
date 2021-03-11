import { IParser, IElement } from './types';
import { CaptionAbstract } from './CaptionAbstract';
import { TRANSLATION_TEMPLATE } from './config';

class SMI extends CaptionAbstract implements IParser {
    private static instance: SMI;
    protected stringifyFormat: string = 'smi';

    public static getInstance(): SMI {
        if (!this.instance) {
            this.instance = new SMI();
        }

        return this.instance;
    }

    public formatElementTemplate(element: IElement): string {
        const node = this.elementToCaption(element);
        const template = `
<SYNC Start=${node.start}>
    <P Class=LANG>${TRANSLATION_TEMPLATE}</P>
</SYNC>
<SYNC Start=${node.end}>
    <P Class=LANG>&nbsp;</P>
</SYNC>
        `;

        return template.trim();
    }
}

export default SMI;
