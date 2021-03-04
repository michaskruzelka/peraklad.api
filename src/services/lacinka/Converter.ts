import { Direction, IRule } from './types';
import { RulesCollection } from './RulesCollection';

class Converter {
    private rulesCollection: RulesCollection;

    constructor() {
        this.rulesCollection = new RulesCollection();
    }

    public async convert(
        text: string,
        direction: Direction = Direction.FORTH
    ): Promise<string> {
        const rules: IRule[] = await this.rulesCollection.getRules(direction);

        for (const rule of rules) {
            text = text.replace(rule.search, rule.replace);
        }

        return text;
    }
}

export { Converter };
