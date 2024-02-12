import { EditorClient, JsonSerializable, Viewport } from 'lucid-extension-sdk';
import { UVXModal } from './uvx-modal';
import { ConnectedDevicesRequest, NetworkRequest } from 'model/uvexplorer-model';
import { isAddDevicesMessage } from 'model/message';

export class ConnectedDevicesModal extends UVXModal {
    viewport: Viewport;
    deviceGuids: string[];

    constructor(client: EditorClient, viewport: Viewport, deviceGuids: string[]) {
        super(client, 'connecteddevices');
        this.viewport = viewport;
        this.deviceGuids = deviceGuids;
    }

    async loadConnectedDevices() {
        // TODO: make api call to get connected devices assuming there will be some function to get network guid for me
        const networkGuid = '82ec3a03-4653-43e2-8363-995b93af5227';
        const networkRequest = new NetworkRequest(networkGuid);
        await this.uvexplorerClient.loadNetwork(this.serverUrl, this.sessionGuid, networkRequest);
        // TODO: now make api call to get connected devices
        const connectedDevicesRequest = new ConnectedDevicesRequest(this.deviceGuids);
        const devices = await this.uvexplorerClient.listConnectedDevices(
            this.serverUrl,
            this.sessionGuid,
            connectedDevicesRequest
        );
        console.log(devices);
        await this.sendMessage({
            action: 'listConnectedDevices',
            devices: JSON.stringify(devices)
        });
    }

    protected async messageFromFrame(message: JsonSerializable) {
        console.log('Received message from child', message);
        if (isAddDevicesMessage(message)) {
            console.log('Message was of addDevices type');
            // TODO: get topo map with device guids from message
            // TODO: add the devices to the doc
            await this.closeSession();
            this.hide();
        }
    }
}
