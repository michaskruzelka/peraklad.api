import { DataSources } from 'datasources/types';
import { ILanguage, ListParams, ListType } from './types';

const resolver = {
    Query: {
        languages: (
            _: any,
            args: ListParams,
            { dataSources }: { dataSources: DataSources }
        ): ILanguage[] => {
            return dataSources.language.getList(args.limit, args.type);
        },
        // groupedLanguages: (
        //     _: any,
        //     args: ListParams,
        //     { dataSources }: { dataSources: DataSources }
        // ): GroupedLanguages => {
        //     return {
        //         PRIMARY: dataSources.language.getList(
        //             args.limit,
        //             ListType.PRIMARY
        //         ),
        //         REMAINING: dataSources.language.getList(
        //             args.limit,
        //             ListType.REMAINING
        //         ),
        //     };
        // },
    },
    GroupedLanguages: {
        PRIMARY: (
            _: any,
            args: ListParams,
            { dataSources }: { dataSources: DataSources }
        ) => {
            console.log('test');

            return dataSources.language.getList(args.limit, ListType.PRIMARY);
        },
    },
};

export default resolver;
