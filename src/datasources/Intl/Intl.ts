import { DataSource } from 'apollo-datasource';

import { Locale } from '../Language/types';
import { Spelling } from '../Spelling';
import { ABC } from '../ABC';
import { MethodName } from './types';
import { Converter } from '../../services/lacinka';
import { SpellingCode } from 'datasources/Spelling/types';

class Intl extends DataSource {
    private locale: Locale;
    private spelling: Spelling;
    private abc: ABC;
    private latinConverter: Converter;

    constructor(locale: Locale, spelling: Spelling, abc: ABC) {
        super();

        this.locale = locale;
        this.spelling = spelling;
        this.abc = abc;
        this.latinConverter = new Converter();
    }

    public async getLocalizedText(
        text: string,
        path: string[]
    ): Promise<string> {
        const intl = this.getLocalizationObject();
        let localizedText = this.accesLocalizationObject(intl, [
            ...path,
            text.toLowerCase(),
        ]);

        if (localizedText) {
            const abc = this.abc.getCurrentABC().code;

            if (abc !== this.abc.getDefaultABC().code) {
                const methodName = this.constructMethodName(abc);
                if (this.isCallable(methodName)) {
                    localizedText = await this[methodName](localizedText);
                }
            }

            return localizedText;
        }

        return text;
    }

    public convertToLatin(
        text: string,
        spelling?: SpellingCode
    ): Promise<string> {
        const spellingCode =
            spelling || this.spelling.getCurrentSpelling().code;

        return this.latinConverter.convert(text, spellingCode);
    }

    private getLocalizationObject() {
        const spelling = this.spelling.getCurrentSpelling().code;

        return require(`./${this.locale}_${spelling}.json`);
    }

    private accesLocalizationObject(
        nestedObj: any,
        pathArr: string[]
    ): string | undefined {
        return pathArr.reduce((obj, key) => {
            return obj && obj[key] !== 'undefined' ? obj[key] : undefined;
        }, nestedObj);
    }

    private constructMethodName(abcCode: string): MethodName {
        const methodName = `convertTo${
            abcCode.charAt(0).toUpperCase() + abcCode.slice(1)
        }`;

        return methodName as MethodName;
    }

    private isCallable(methodName: MethodName): boolean {
        return typeof this[methodName] === 'function';
    }
}

export { Intl };
