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
    formatElementTemplate: (element: IElement, options?: any) => string;
}

interface ICaption {
    start: number;
    end: number;
    text: string;
    type: string;
}

export { IParser, IElement, ISubtitleElementContext, ICaption };
