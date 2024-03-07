import { Device } from 'model/uvx/device';
import { UVXModal } from './uvx-modal';
import { EditorClient } from 'lucid-extension-sdk';
import { DocumentEditor } from 'src/doc/documentEditor';

export class DeviceDetailModal extends UVXModal {
    device: Device;

    constructor(client: EditorClient, docEditor: DocumentEditor, device: Device) {
        super(client, docEditor, 'device-detail');
        this.device = device;
    }

    async getDeviceDetails() {
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
