import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { DocumentNode, GraphQLSchema } from 'graphql';
import path from 'path';
import {
    range,
    stringLength,
    ValidateDirectiveVisitor,
} from '@profusion/apollo-validation-directives';
import {
    makeAugmentedSchema,
    makeAugmentedSchemaOptions,
} from 'neo4j-graphql-js';

import { resolvers } from './resolvers';
import { resolveTypes } from './typeResolver';

const typeDefsList: DocumentNode[] = [
    ...loadFilesSync(path.join(__dirname, '../../**/*.graphql')),
    ...range.getTypeDefs(),
    ...stringLength.getTypeDefs(),
    ...ValidateDirectiveVisitor.getMissingCommonTypeDefs(),
];
const typeDefsAsOne: DocumentNode = mergeTypeDefs(typeDefsList);

const typesNotToAugment = [
    'Language',
    'GroupedLanguages',
    'Movie',
    'Episode',
    'IMDB',
    'Series',
    'ProjectAccessType',
    'ABC',
    'Spelling',
    'FileFormat',
    'ValidatedInputErrorOutput',
];

const schemaOptions: makeAugmentedSchemaOptions = {
    typeDefs: typeDefsAsOne,
    resolvers,
    schemaDirectives: { range, stringLength },
    config: {
        query: {
            exclude: typesNotToAugment,
        },
        mutation: {
            exclude: typesNotToAugment,
        },
    },
};

const schema: GraphQLSchema = makeAugmentedSchema(schemaOptions);

// Prevents neo4j auto-generated input types (start with '_')
// from validation check
Object.values(schema.getTypeMap()).forEach((type: any) => {
    if ('_' === type.name.charAt(0)) {
        type.mustValidateInput = false;
    }
});
ValidateDirectiveVisitor.addValidationResolversToSchema(schema);

resolveTypes(schema);

export { schema };
