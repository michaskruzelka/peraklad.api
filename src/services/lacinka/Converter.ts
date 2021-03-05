import { Direction, IRule } from './types';
import { RulesCollection } from './RulesCollection';
import { SpellingCode } from 'datasources/Spelling/types';

class Converter {
    private rulesCollection: RulesCollection;

    constructor(rulesCollection: RulesCollection) {
        this.rulesCollection = rulesCollection;
    }

    public static async getInstance() {
        const rulesCollection = new RulesCollection();
        await rulesCollection.initRules();
    
        return new Converter(rulesCollection);
    }

    public convert(
        text: string,
        spelling: SpellingCode,
        direction: Direction = Direction.FORTH
    ): string {
        const rules: IRule[] = this.rulesCollection.getRules(direction);
        let convertedText = text.trim();

        for (const rule of rules) {
            if (this.isRuleEligible(rule, spelling)) {
                convertedText = convertedText.replace(
                    rule.search,
                    rule.replace
                );
            }
        }

        return convertedText;
    }

    private isRuleEligible(rule: IRule, spelling: SpellingCode): boolean {
        return !rule.spellings || rule.spellings.includes(spelling);
    }
}

export { Converter };
