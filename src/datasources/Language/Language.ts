import { DataSource } from 'apollo-datasource';
import { ValidationError } from 'apollo-server-lambda';

import languages from './languages.json';
import * as config from './config';
import { ILanguage, IDataSource, Locale, ListType } from './types';

class Language extends DataSource implements IDataSource {
    /**
     * @param [limit] the maximum languages to return
     * @param [type] the type of the list: all, primary only, remaining only
     *
     * @returns the full language list from config
     */
    public getList(
        limit: number = 1000,
        type: ListType = ListType.ALL
    ): ILanguage[] {
        let langList = languages;
        if (type === ListType.PRIMARY) {
            langList = langList
                .filter((lang) => {
                    return config.PRIMARY_LANGS.includes(lang.code);
                })
                .sort((a, b) => {
                    return (
                        config.PRIMARY_LANGS.indexOf(a.code) -
                        config.PRIMARY_LANGS.indexOf(b.code)
                    );
                });
        } else if (type === ListType.REMAINING) {
            langList = langList.filter((lang) => {
                return !config.PRIMARY_LANGS.includes(lang.code);
            });
        }

        return langList
            .filter((lang) => lang.code !== this.getCurrentLocale())
            .slice(0, limit);
    }

    /**
     * @param code the code of language
     *
     * @returns finds language by code
     *
     * @throws when the language is not found
     */
    public get(code: string): ILanguage {
        const language = languages.find((lang) => lang.code === code);

        if (!language) {
            throw new Error('Language not found.');
        }

        return language;
    }

    /**
     * @param name the english name of language
     * @param returnDefaultOnError return default code in case of an error
     *
     * @returns finds language by english name
     *
     * @throws when the language is not found
     */
    public getByName(
        name: string,
        returnDefaultOnError: boolean = true
    ): ILanguage {
        const language = languages.find((lang) => lang.name === name);

        if (!language) {
            if (returnDefaultOnError) {
                return this.getDefaultLanguage();
            }

            throw new Error('Language not found.');
        }

        return language;
    }

    /**
     * return the default language
     */
    public getDefaultLanguage(): ILanguage {
        const language = languages.find(
            (lang) => lang.code === config.DEFAULT_LANG
        );

        if (!language) {
            throw new Error('Language not found.');
        }

        return language;
    }

    /**
     * @returns current language (be|uk)
     */
    public getCurrentLocale(): Locale {
        return (process.env.LOCALE ?? this.getDefaultLocale()) as Locale;
    }

    /**
     * Determines whether language codes are valid
     *
     * @param list of langauge codes
     *
     * @returns true if every code in the list is valid
     */
    public isValidCodes(codes: string[]): boolean {
        const allLanguagesCodes = languages.map((language) => language.code);

        return codes && codes.every((code) => allLanguagesCodes.includes(code));
    }

    public validateCode(code: string): void {
        if (!this.isValidCodes([code])) {
            throw new ValidationError('Language code is not valid.');
        }
    }

    /**
     * @returns default language (be|uk)
     */
    private getDefaultLocale(): Locale {
        return config.DEFAULT_LOCALE;
    }
}

export { Language };
