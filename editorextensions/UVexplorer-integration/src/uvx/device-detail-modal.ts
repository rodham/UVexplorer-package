import { Device } from 'model/uvx/device';
import { UVXModal } from './uvx-modal';
import { EditorClient, Viewport } from 'lucid-extension-sdk';
import { UVExplorerClient } from '@uvx/uvx-client';

export class DeviceDetailModal extends UVXModal {
    device: Device;

    constructor(client: EditorClient, viewport: Viewport, uvxClient: UVExplorerClient, device: Device) {
        super(client, viewport, uvxClient, 'device-detail');
        this.device = device;
    }

    async getDeviceDetails() {
        await this.loadPageNetwork();
        const deviceDetails = await this.uvexplorerClient.listDeviceDetails(
            this.serverUrl,
            this.sessionGuid,
            this.device.guid
        );
        console.log('Device details response: ', deviceDetails);

        await this.sendMessage({
            action: 'viewDeviceDetails',
            deviceDetails: JSON.stringify(deviceDetails),
            device: JSON.stringify(this.device)
        });
    }
}
