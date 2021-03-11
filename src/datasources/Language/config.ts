import { LocaleShort, LocaleFull } from './types';

const DEFAULT_LOCALE = LocaleShort.BE;
const DEFAULT_LANG = 'en';

const PRIMARY_LANGS = ['en', 'ru', 'pl', 'de', 'fr', 'ko'];

const LOCALES = {
    [LocaleShort.BE]: LocaleFull.BE,
    [LocaleShort.UK]: LocaleShort.UK,
};

export { DEFAULT_LOCALE, PRIMARY_LANGS, DEFAULT_LANG, LOCALES };
