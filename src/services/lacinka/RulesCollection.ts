import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import yamlTypes from 'js-yaml-js-types';

import { Direction, IRule, IRuleCollection } from './types';

const yarnSchema = yaml.DEFAULT_SCHEMA.extend(yamlTypes.all);

class RulesCollection {
    private rules: IRuleCollection = {};

    public async getRules(direction: Direction): Promise<IRule[]> {
        if (!this.rules[direction]) {
            await this.initRules(direction);
        }

        return this.rules[direction];
    }

    private async initRules(direction: Direction): Promise<void> {
        const fileName = `${direction}.yaml`;
        let yamlData: { rules: IRule[] };

        try {
            const fileContents = await this.readFile(fileName);
            yamlData = yaml.load(fileContents, { schema: yarnSchema }) as any;
        } catch (e) {
            throw new Error('No rules file found.');
        }

        if (!yamlData.rules) {
            yamlData.rules = [];
        }

        const rules = yamlData.rules;
        rules.filter(this.isRuleValid);
        this.sortRules(rules);
        this.rules[direction] = rules;
    }

    private isRuleValid(rule: IRule): boolean {
        return (
            typeof rule.sort !== 'undefined' &&
            !!rule.search &&
            typeof rule.replace !== 'undefined'
        );
    }

    private sortRules(rules: IRule[]): void {
        rules.sort((a, b) => a.sort - b.sort);
    }

    private readFile(fileName: string): Promise<string> {
        return fs.promises.readFile(
            path.join(__dirname, `./rules/${fileName}`),
            'utf8'
        );
    }
}

export { RulesCollection };
