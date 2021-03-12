import samiParser from 'sami-parser';

import { IParser, IElement, SAMIResultItem } from './types';
import { CaptionAbstract } from './CaptionAbstract';
import { TRANSLATION_TEMPLATE } from './config';
import {
    createReadableFromElements,
    mapElementStream,
    promisifyElementsStream,
} from './utils';

class SMI extends CaptionAbstract implements IParser {
    private static instance: SMI;
    protected stringifyFormat: string = 'smi';

    public static getInstance(): SMI {
        if (!this.instance) {
            this.instance = new SMI();
        }

        return this.instance;
    }

    public parse(
        contents: string,
        { languageCode }: { languageCode: string }
    ): Promise<IElement[]> {
        const { result: nodes, errors } = samiParser.parse(contents);
        if (errors.length > 1) {
            throw new Error(`Could not parse SMI file. ${errors[0]}`);
        }

        const stream = createReadableFromElements(nodes).pipe(
            mapElementStream((node: SAMIResultItem) =>
                this.resultItemToElement(node, languageCode)
            )
        );

        return promisifyElementsStream(stream);
    }

    public formatElementTemplate(element: IElement): string {
        const node = this.elementToCaption(element);
        const template = `
<SYNC Start=${node.start}>
    <P Class=BEBYCC>${TRANSLATION_TEMPLATE}</P>
</SYNC>
<SYNC Start=${node.end}>
    <P Class=BEBYCC>&nbsp;</P>
</SYNC>
        `;

        return template.trim();
    }

    // private createCaptionsStream(contents: string): Readable {
    //     const stream = createReadableFromElements([]);

    //     // const parts = contents.split(/\r?\n\s*\r?\n/);

    //     // for (const part of parts) {

    //     //         stream.push(part);

    //     // }

    //     return stream;
    // }

    // private stripTags(input: string, allowed: string) {
    //     const allowedTags = (
    //         ((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) ||
    //         []
    //     ).join('');
    //     const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    //         commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

    //     return input
    //         .replace(commentsAndPhpTags, '')
    //         .replace(tags, function ($0: string, $1: string) {
    //             return allowedTags.indexOf('<' + $1.toLowerCase() + '>') > -1
    //                 ? $0
    //                 : '';
    //         });
    // }

    // langs = getLanguage(element);
    //     if (langs.length < 1) {
    //       error('ERROR_INVALID_LANGUAGE');
    //     }
    //     lang = langs[0];

    // for (_lang of langs) {
    //     var testTest2 = element.match(_lang.reClassName);
    //     var testText = element.trim().match(new RegExp(`class[^=]*?=["'S]*(${testTest2[1]})([^(\<\/P\>)]*)(\>)([^(\<\/P\>)]+)(\<\/P\>)`, 'ig'));

    //     console.log(Array.from(testText));

    //     item.languages[_lang.lang] = testText[4] || innerText;
    //     tempRet[_lang] || (tempRet[_lang] = []);
    //     tempRet[_lang].push(item);
    // }

    // getLanguage = function(element) {
    //     var className, lang;
    //     var langs = [];
    //     for (className in definedLangs) {
    //       lang = definedLangs[className];
    //       if (lang.reClassName.test(element)) {
    //           langs.push(lang);
    //       }
    //     }
  
    //     return langs;
    //   };

    private resultItemToElement(
        item: SAMIResultItem,
        languageCode: string
    ): IElement {
        return {
            text:
                item.languages[languageCode] ||
                Object.values(item.languages)[0],
            context: {
                timing: {
                    startsAt: item.startTime,
                    endsAt: item.endTime,
                },
            },
        };
    }
}

export default SMI;
