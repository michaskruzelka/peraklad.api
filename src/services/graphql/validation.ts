import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';

const validationRules = [
    depthLimit(10),
    createComplexityLimitRule(1500, {
        introspectionListFactor: 0.1,
    }),
];

export { validationRules };
