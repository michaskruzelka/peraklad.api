interface IElement {
    text: string;
}

interface IParser {
    parse: (contents: string) => Promise<IElement[]>;
    format: (elements: IElement[]) => string;
    formatElement: (element: IElement) => string;
}

export { IParser, IElement };
