import { loadFiles } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
import { IResolvers } from 'graphql-tools';
import path from 'path';

const getResolvers = async (): Promise<IResolvers> => {
    const resolversArray = await loadFiles(
        path.join(__dirname, '../../datasources/**/resolver.*')
    );

    return mergeResolvers(resolversArray);
};

export { getResolvers };
