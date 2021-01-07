import { DataSource } from 'apollo-datasource';
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

        return langList.slice(0, limit);
    }

    /**
     * @returns current language (be|uk)
     */
    public getCurrentLocale(): Locale {
        return (process.env.LOCALE ?? this.getDefaultLocale()) as Locale;
    }

    /**
     * @returns default language (be|uk)
     */
    public getDefaultLocale(): Locale {
        return config.DEFAULT_LOCALE;
    }
}

export { Language };
