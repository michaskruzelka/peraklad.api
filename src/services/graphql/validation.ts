import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';

const validationRules = [
    depthLimit(10),
    createComplexityLimitRule(10000, {
        introspectionListFactor: 0.1,
        // onCost: (cost: any) => {
        //     console.log('query cost:', cost);
        // },
    }),
];

export { validationRules };
