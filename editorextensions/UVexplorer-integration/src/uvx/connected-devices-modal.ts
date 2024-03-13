import { EditorClient, JsonSerializable } from 'lucid-extension-sdk';
import { UVXModal } from './uvx-modal';
import { ConnectedDevicesRequest } from 'model/uvx/device';
import { DocumentClient } from 'src/doc/document-client';
import { isLoadMapSettingsMessage, isSelectedDevicesMessage, isSelectedMapSettingsMessage } from 'model/message';
import { UVExplorerClient } from '@uvx/uvx-client';
import { DataClient } from '@data/data-client';

export class ConnectedDevicesModal extends UVXModal {
    deviceGuids: string[];
    visibleConnectedDeviceGuids: string[];

    constructor(
        client: EditorClient,
        docEditor: DocumentClient,
        uvxClient: UVExplorerClient,
        data: DataClient,
        deviceGuids: string[],
        visibleConnectedDeviceGuids: string[]
    ) {
        super(client, docEditor, uvxClient, data, 'devices');
        this.deviceGuids = deviceGuids;
        this.visibleConnectedDeviceGuids = visibleConnectedDeviceGuids;
    }

    async sendConnectedDevices() {
        await this.loadPageNetwork();
        const connectedDevicesRequest = new ConnectedDevicesRequest(this.deviceGuids);
        const devices = await this.uvxClient.listConnectedDevices(connectedDevicesRequest);
        console.log('Devices to send to modal', devices);
        console.log('Visible connected devices to send to modal', this.visibleConnectedDeviceGuids);

        await this.sendMessage({
            action: 'listDevices',
            devices: JSON.stringify(devices),
            visibleConnectedDeviceGuids: JSON.stringify(this.visibleConnectedDeviceGuids),
            forceAutoLayout: true
        });
        console.log('Done sending message');
    }

    protected async messageFromFrame(message: JsonSerializable) {
        console.log('Received message from child', message);
        if (isSelectedDevicesMessage(message)) {
            //const devices = message.devices.map((d) => d.guid);
            let removeDevices: string[] = [];
            if (message.removeDevices) {
                removeDevices = message.removeDevices;
            }
            await this.drawMap(message.devices, message.autoLayout, removeDevices);
            await this.closeSession();
            this.hide();
        } else if (isLoadMapSettingsMessage(message)) {
            await this.sendMapSettings();
        } else if (isSelectedMapSettingsMessage(message)) {
            this.saveSettings(message.drawSettings, message.layoutSettings);
            await this.reloadDevices();
        }
    }
}
