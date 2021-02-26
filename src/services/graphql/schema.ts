import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { DocumentNode, GraphQLSchema } from 'graphql';
import path from 'path';
import {
    range,
    stringLength,
    listLength,
    ValidateDirectiveVisitor,
} from '@profusion/apollo-validation-directives';
import {
    makeAugmentedSchema,
    makeAugmentedSchemaOptions,
} from 'neo4j-graphql-js';

import { getResolvers } from './resolvers';
import { resolveTypes } from './typeResolver';

const getSchema = async (): Promise<GraphQLSchema> => {
    const typeDefsList: DocumentNode[] = [
        ...(await loadFiles(path.join(__dirname, '../../../src/**/*.graphql'))),
        ...range.getTypeDefs(),
        ...stringLength.getTypeDefs(),
        ...listLength.getTypeDefs(),
        ...ValidateDirectiveVisitor.getMissingCommonTypeDefs(),
    ];
    const typeDefsAsOne: DocumentNode = mergeTypeDefs(typeDefsList);

    const typesToIgnore = [
        'Language',
        'GroupedLanguages',
        'OMDB',
        'OMDBMovie',
        'OMDBEpisode',
        'OMDBSeries',
        'IMDB',
        'Movie',
        'Episode',
        'Series',
        'VideoInfo',
        'VideoStreamService',
        'ProjectAccessType',
        'ImdbSubtitlesResponse',
        'ImdbSubtitlesFile',
        'ABC',
        'Spelling',
        'FileFormat',
        'SubtitlesSearchService',
        'ValidatedInputErrorOutput',
        'Project',
        'ProjectLevel',
        'ProjectSettings',
        'ProjectStatus',
        'ResourceStatus',
    ];

    const schemaOptions: makeAugmentedSchemaOptions = {
        typeDefs: typeDefsAsOne,
        resolvers: await getResolvers(),
        schemaDirectives: { range, stringLength, listLength },
        config: {
            query: {
                exclude: typesToIgnore,
            },
            mutation: false,
        },
    };

    const schema = makeAugmentedSchema(schemaOptions);

    // Prevents neo4j auto-generated input types (start with '_')
    // from validation check
    Object.values(schema.getTypeMap()).forEach((type: any) => {
        if ('_' === type.name.charAt(0)) {
            type.mustValidateInput = false;
        }
    });

    ValidateDirectiveVisitor.addValidationResolversToSchema(schema);
    resolveTypes(schema);

    return schema;
};

export { getSchema };
