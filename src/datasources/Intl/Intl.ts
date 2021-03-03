import { DataSource } from 'apollo-datasource';

import { Locale } from '../Language/types';
import { Spelling } from '../Spelling';
import { ABC } from '../ABC';

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

        return (
            this.accesLocalizationObject(intl, [...path, text.toLowerCase()]) ||
            text
        );
    }

    private getLocalizationObject() {
        const abc = this.abc.getCurrentABC().code;
        const spelling = this.spelling.getCurrentSpelling().code;

        return require(`./${this.locale}_${abc}_${spelling}.json`);
    }

    private accesLocalizationObject(nestedObj: any, pathArr: string[]) {
        return pathArr.reduce((obj, key) => {
            return obj && obj[key] !== 'undefined' ? obj[key] : undefined;
        }, nestedObj);
    }
}

export { Intl };
