import { EditorClient, JsonSerializable } from 'lucid-extension-sdk';
import { UVXModal } from './uvx-modal';
import { isSelectedMapSettingsMessage } from 'model/message';
import { DocumentClient } from 'src/doc/document-client';
import { UVExplorerClient } from '@uvx/uvx-client';
import { DataClient } from '@data/data-client';
import { NetworkRequest } from 'model/uvx/network';

export class SettingsModal extends UVXModal {
    constructor(client: EditorClient, docClient: DocumentClient, uvxClient: UVExplorerClient, data: DataClient) {
        super(client, docClient, uvxClient, data, 'settings');
    }

    async redrawMap() {
        let devices: string[] = this.docClient.getNetworkDeviceBlockGuids();
        if (devices.length > 1) {
            // TODO: I need to load the correct network before I redraw the map - just need to test this
            const networkGuid: string = this.dataClient.getNetworkForPage(this.docClient.getPageId()!);
            await this.uvxClient.loadNetwork(new NetworkRequest(networkGuid));
            await this.drawMap(devices, []);
        }
    }

    protected async messageFromFrame(message: JsonSerializable) {
        console.log('Received a message from the child.');
        console.log(message);
        if (isSelectedMapSettingsMessage(message)) {
            this.docClient.saveSettings(message.drawSettings, message.layoutSettings);
            await this.redrawMap();
            await this.closeSession();
            this.hide();
        }
    }
}
