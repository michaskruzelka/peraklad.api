enum Direction {
    BACK = 'back',
    FORTH = 'forth',
}

interface IRule {
    name: string;
    sort: number;
    search: string;
    replace: string;
    description?: string;
}

interface IRuleCollection {
    [key: string]: IRule[]
}

export { Direction, IRule, IRuleCollection };
