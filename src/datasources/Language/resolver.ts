import { DataSources } from 'datasources/types';
import { ILanguage, ListArgs, GetOneArg, ListType, LocaleShort } from './types';

const resolver = {
    Query: {
        languages: (
            _: any,
            args: ListArgs,
            { dataSources }: { dataSources: DataSources }
        ): any => {
            return dataSources.language.getList(args.limit, args.type);
        },
        groupedLanguages: () => ({}),
        locale: (
            _: any,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): LocaleShort => {
            return dataSources.language.getCurrentLocale();
        },
        language: (
            _: any,
            args: GetOneArg,
            { dataSources }: { dataSources: DataSources }
        ): ILanguage => {
            return dataSources.language.get(args.code);
        },
    },
    GroupedLanguages: {
        PRIMARY: (
            _: any,
            args: ListArgs,
            { dataSources }: { dataSources: DataSources }
        ) => {
            return dataSources.language.getList(args.limit, ListType.PRIMARY);
        },
        REMAINING: (
            _: any,
            args: ListArgs,
            { dataSources }: { dataSources: DataSources }
        ) => {
            return dataSources.language.getList(args.limit, ListType.REMAINING);
        },
    },
};

export default resolver;
