import { EditorClient, JsonSerializable, Viewport } from 'lucid-extension-sdk';
import { UVXModal } from './uvx-modal';
import { ConnectedDevicesRequest } from 'model/uvexplorer-model';
import { isSelectedDevicesMessage } from 'model/message';

export class ConnectedDevicesModal extends UVXModal {
    deviceGuids: string[];
    visibleConnectedDeviceGuids: string[];

    constructor(
        client: EditorClient,
        viewport: Viewport,
        deviceGuids: string[],
        visibleConnectedDeviceGuids: string[]
    ) {
        super(client, viewport, 'devices');
        this.deviceGuids = deviceGuids;
        this.visibleConnectedDeviceGuids = visibleConnectedDeviceGuids;
    }

    async loadConnectedDevices() {
        await this.loadPageNetwork();
        const connectedDevicesRequest = new ConnectedDevicesRequest(this.deviceGuids);
        const devices = await this.uvexplorerClient.listConnectedDevices(
            this.serverUrl,
            this.sessionGuid,
            connectedDevicesRequest
        );
        console.log('Devices to send to modal', devices);
        console.log('Visible connected devices to send to modal', this.visibleConnectedDeviceGuids);

        await this.sendMessage({
            action: 'listDevices',
            devices: JSON.stringify(devices),
            visibleConnectedDeviceGuids: JSON.stringify(this.visibleConnectedDeviceGuids)
        });
        console.log('Done sending message');
    }

    protected async messageFromFrame(message: JsonSerializable) {
        console.log('Received message from child', message);
        if (isSelectedDevicesMessage(message)) {
            const devices = message.devices;
            let removeDevices: string[] = [];
            if (message.removeDevices) {
                removeDevices = message.removeDevices;
            }
            await this.drawDevices(devices, removeDevices);
            await this.closeSession();
            this.hide();
        }
    }
}
