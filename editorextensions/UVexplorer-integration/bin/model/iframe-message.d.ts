export interface OpenSessionMessage {
    action: 'openSession';
    apiKey: string;
    serverUrl: string;
}
export declare function isOpenSessionMessage(message: any): message is OpenSessionMessage;
