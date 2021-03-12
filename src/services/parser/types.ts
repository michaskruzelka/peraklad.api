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
    parse: (contents: string, options?: any) => Promise<IElement[]>;
    format: (elements: IElement[], options?: any) => Promise<string>;
    formatElementTemplate: (element: IElement, options?: any) => string;
}

interface ICaption {
    start: number;
    end: number;
    text: string;
    type: string;
}

interface SAMIResultItem {
    startTime: number;
    endTime: number;
    languages: {
        [key: string]: string;
    };
}

export { IParser, IElement, ISubtitleElementContext, ICaption, SAMIResultItem };
