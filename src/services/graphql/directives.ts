import { SchemaDirectiveVisitor } from 'apollo-server-lambda';
import { defaultFieldResolver } from 'graphql';

class IntlDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: any, details: any) {
        const { resolve = defaultFieldResolver } = field;
        field.resolve = async function (...args: any[]) {
            const context = args[2];
            const defaultText = await resolve.apply(this, args);
            const path = [details.objectType.name, field.name];

            return await context.dataSources.intl.getLocalizedText(
                defaultText,
                path
            );
        };
    }
}

export { IntlDirective as intl };
