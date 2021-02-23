import { DataSources } from '../types';
import { FileFormat, FileFormatsArgs, IResource } from './types';

const resolver = {
    Query: {
        fileFormats: (
            _: any,
            args: FileFormatsArgs,
            { dataSources }: { dataSources: DataSources }
        ): FileFormat[] => {
            const fileFormats = dataSources.resource.getFileFormats(
                args.category,
                args.subCategory
            );

            return fileFormats.map((fileFormat) => ({
                ...fileFormat,
                description: fileFormat.description || null,
            }));
        },
    },
    Resource: {
        format: (
            resource: IResource,
            __: any,
            { dataSources }: { dataSources: DataSources }
        ): FileFormat => {
            return dataSources.resource.getFileFormatByCode(
                resource.format.code,
                resource.project.category,
                resource.project.subCategory
            );
        },
    },
    FileFormat: {
        description: () => {},
    },
};

export { resolver };
