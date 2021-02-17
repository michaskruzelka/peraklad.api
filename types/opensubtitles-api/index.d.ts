declare module 'opensubtitles-api' {
    export default class OpenSubtitles {
        constructor(creds: any);
        login();
        search(info: any): Promise<any>;
        api: any;
    };
}
