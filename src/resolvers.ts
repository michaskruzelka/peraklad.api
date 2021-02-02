import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
import { IResolvers } from 'graphql-tools';
import path from 'path';

const resolversArray = loadFilesSync(
    path.join(__dirname, './datasources/**/resolver.*'),
    {
        ignoreIndex: true,
    }
);

const resolvers: IResolvers = mergeResolvers(resolversArray);

export default resolvers;
