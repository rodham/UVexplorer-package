import { Device } from 'model/uvx/device';
import { UVXModal } from './uvx-modal';
import { EditorClient } from 'lucid-extension-sdk';
import { DocumentClient } from 'src/doc/document-client';
import { UVExplorerClient } from '@uvx/uvx-client';
import { DataClient } from '@data/data-client';

export class DeviceDetailModal extends UVXModal {
    device: Device;

    constructor(client: EditorClient, docEditor: DocumentClient, uvxClient: UVExplorerClient, data: DataClient, device: Device) {
        super(client, docEditor, uvxClient, data, 'device-detail');
        this.device = device;
    }

    async sendDeviceDetails() {
        await this.loadPageNetwork();
        const deviceDetails = await this.uvxClient.listDeviceDetails(this.device.guid);
        console.log('Device details response: ', deviceDetails);

        await this.sendMessage({
            action: 'viewDeviceDetails',
            deviceDetails: JSON.stringify(deviceDetails),
            device: JSON.stringify(this.device)
        });
    }
}
