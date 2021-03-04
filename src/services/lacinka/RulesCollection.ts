import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import yamlTypes from 'js-yaml-js-types';

import { Direction, IRule, IRuleCollection } from './types';
import { AVAILABLE_DIRECTIONS } from './config';

const yarnSchema = yaml.DEFAULT_SCHEMA.extend(yamlTypes.all);

class RulesCollection {
    private rules: IRuleCollection = {};

    constructor() {
        this.initRules();
    }

    public async getRules(direction: Direction): Promise<IRule[]> {
        console.log(this.rules);
        
        if (!this.rules[direction]) {
            return [];
        }

        return this.rules[direction];
    }

    private async initRules(): Promise<void> {
        AVAILABLE_DIRECTIONS.map((direction) =>
            this.initRulePerDirection(direction)
        );
    }

    private async initRulePerDirection(direction: Direction): Promise<void> {
        const fileName = `${direction}.yaml`;
        let yamlData: { rules: IRule[] };

        try {
            const fileContents = await this.readFile(fileName);
            yamlData = yaml.load(fileContents, { schema: yarnSchema }) as any;
        } catch (e) {
            console.log(e.message);
            throw new Error('No rules file found.');
        }

        if (!yamlData.rules) {
            yamlData.rules = [];
        }

        let rules = yamlData.rules;
        rules = rules.filter(this.isRuleValid);
        this.sortRules(rules);

        console.log('inited');
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
