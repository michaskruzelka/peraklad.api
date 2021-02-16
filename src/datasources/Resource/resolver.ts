import { DataSources } from '../../datasources/types';
import { FileFormatsArgs, FileFormatsResponse } from './types';

const resolver = {
    Query: {
        fileFormats: (
            _: any,
            args: FileFormatsArgs,
            { dataSources }: { dataSources: DataSources }
        ): FileFormatsResponse => {
            const fileFormats = dataSources.resource.getFileFormats(
                args.category,
                args.subcategory
            );

            return fileFormats.map((fileFormat) => ({
                ...fileFormat,
                description: fileFormat.description || null,
            }));
        },
    },
};

export { resolver };
