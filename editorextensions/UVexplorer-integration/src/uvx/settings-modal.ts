import { EditorClient, JsonSerializable } from 'lucid-extension-sdk';
import { UVXModal } from './uvx-modal';
import { isSelectedMapSettingsMessage } from 'model/message';
import { DocumentClient } from 'src/doc/document-client';
import { UVExplorerClient } from '@uvx/uvx-client';
import { DataClient } from '@data/data-client';

export class SettingsModal extends UVXModal {
    constructor(client: EditorClient, docEditor: DocumentClient, uvxClient: UVExplorerClient, data: DataClient) {
        super(client, docEditor, uvxClient, data, 'settings');
    }

    protected messageFromFrame(message: JsonSerializable) {
        console.log('Received a message from the child.');
        console.log(message);
        if (isSelectedMapSettingsMessage(message)) {
            this.saveSettings(message.drawSettings, message.layoutSettings);
            this.hide();
        }
    }
}