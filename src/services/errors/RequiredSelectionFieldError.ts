import { ValidationError } from 'apollo-server';

class RequiredSelectionFieldError extends ValidationError {
    constructor(selectionField: string) {
        const message = `Field "${selectionField}" must be included in query.`;
        super(message);
    }
}

export default RequiredSelectionFieldError;
