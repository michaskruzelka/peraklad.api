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
    formatElementTemplate: (element: IElement) => string;
}

interface ISMINode {
    startTime: number;
    endTime: number;
    languages: {
        [key: string]: string;
    }
}

export { IParser, IElement, ISubtitleElementContext, ISMINode };
