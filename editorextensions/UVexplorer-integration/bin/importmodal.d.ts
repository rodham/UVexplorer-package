import { EditorClient, Modal } from 'lucid-extension-sdk';
export interface ImportModalMessage {
    'name': string;
    'content': string;
}
export declare class ImportModal extends Modal {
    constructor(client: EditorClient);
    protected frameLoaded(): void;
    protected messageFromFrame(message: ImportModalMessage): void;
}
