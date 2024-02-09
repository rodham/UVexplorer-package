import { DataSourceProxy, EditorClient, JsonSerializable, Viewport } from 'lucid-extension-sdk';
import { isLoadNetworkMessage } from '../model/message';
import { DeviceListRequest, NetworkRequest } from '../model/uvexplorer-model';
import { UVXModal } from './uvx-modal';
import {
    addDevicesToCollection,
    createOrRetrieveDeviceCollection,
    createOrRetrieveNetworkSource
} from './data-collections';

export class UVexplorerModal extends UVXModal {
    private viewport: Viewport;

    constructor(client: EditorClient, viewport: Viewport) {
        super(client);

        this.viewport = viewport;
    }

    async listNetworks() {
        const networks = await this.uvexplorerClient.listNetworks(this.serverUrl, this.sessionGuid);
        const filteredNetworks = networks.filter((n) => n.name !== '');
        console.log(`Successfully retrieved network list.`);
        await this.sendMessage({
            action: 'listNetworks',
            network_summaries: JSON.stringify(filteredNetworks)
        });
    }

    async loadNetwork(name: string, guid: string) {
        const networkRequest = new NetworkRequest(guid);
        await this.uvexplorerClient.loadNetwork(this.serverUrl, this.sessionGuid, networkRequest);
        const source = createOrRetrieveNetworkSource(name, guid);
        console.log(`Successfully loaded network: ${name}`);
        return source;
    }

    async loadDevices(source: DataSourceProxy) {
        const collection = createOrRetrieveDeviceCollection(source);
        const deviceListRequest = new DeviceListRequest();
        const devices = await this.uvexplorerClient.listDevices(this.serverUrl, this.sessionGuid, deviceListRequest);
        addDevicesToCollection(collection, devices);
        console.log(`Successfully loaded devices: ${source.getName()}`);
    }

    protected async messageFromFrame(message: JsonSerializable) {
        console.log('Received a message from the child.');
        console.log(message);
        if (isLoadNetworkMessage(message)) {
            const source = await this.loadNetwork(message.name, message.network_guid);
            await this.loadDevices(source);
        }
    }
}
