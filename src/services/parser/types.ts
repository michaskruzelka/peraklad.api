interface ISubtitleElementContext {
    timing: {
        startsAt: number;
        endsAt: number;
    };
}

interface ISoftwareElementContext {
    key: string;
}

interface IElement {
    text: string;
    context: ISubtitleElementContext | ISoftwareElementContext;
}

interface IParser {
    parse: (contents: string) => Promise<IElement[]>;
    format: (elements: IElement[]) => Promise<string>;
}

export { IParser, IElement, ISubtitleElementContext };
