declare module 'graphql-validation-complexity' {
    export function createComplexityLimitRule(
        maxCost: any,
        { onCost, createError, formatErrorMessage, ...options }: ?any = {}
    ): any;
}
