import { DataSource } from 'apollo-datasource';

import { Locale } from '../Language/types';
import { Spelling } from '../Spelling';
import { ABC } from '../ABC';
import { MethodName } from './types';

class Intl extends DataSource {
    private locale: Locale;
    private spelling: Spelling;
    private abc: ABC;

    constructor(locale: Locale, spelling: Spelling, abc: ABC) {
        super();

        this.locale = locale;
        this.spelling = spelling;
        this.abc = abc;
    }

    public getLocalizedText(text: string, path: string[]): string {
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
                    localizedText = this[methodName](localizedText);
                }
            }

            return localizedText;
        }

        return text;
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

    private convertToLatin(text: string): string {
        // const spelling = this.spelling.getCurrentSpelling().code;
        // convert via service

        return text;
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
