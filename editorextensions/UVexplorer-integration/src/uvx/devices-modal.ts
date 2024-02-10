import { DataSourceProxy, EditorClient, JsonSerializable, Viewport } from 'lucid-extension-sdk';
import { isLoadNetworkMessage, isSelectedDevicesMessage } from 'model/message';
import { DeviceListRequest, NetworkRequest } from 'model/uvexplorer-model';
import { UVXModal } from './uvx-modal';
import {
    addDevicesToCollection,
    createOrRetrieveDeviceCollection,
    createOrRetrieveNetworkSource
} from '../data-collections';

export class UVexplorerModal extends UVXModal {
    private viewport: Viewport;

    constructor(client: EditorClient, viewport: Viewport) {
        super(client);

        this.viewport = viewport;
    }

    async listNetworks() {
        try {
            const networks = await this.uvexplorerClient.listNetworks(this.serverUrl, this.sessionGuid);
            const filteredNetworks = networks.filter((n) => n.name !== '');
            console.log(`Successfully retrieved network list.`);
            await this.sendMessage({
                action: 'listNetworks',
                network_summaries: JSON.stringify(filteredNetworks)
            });
        } catch (e) {
            console.error(e);
        }
    }

    async loadNetwork(name: string, guid: string): Promise<DataSourceProxy | undefined> {
        try {
            const networkRequest = new NetworkRequest(guid);
            await this.uvexplorerClient.loadNetwork(this.serverUrl, this.sessionGuid, networkRequest);
            const source = createOrRetrieveNetworkSource(name, guid);
            console.log(`Successfully loaded network: ${name}`);
            return source;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async loadDevices(source: DataSourceProxy) {
        try {
            const collection = createOrRetrieveDeviceCollection(source);
            const deviceListRequest = new DeviceListRequest();
            const devices = await this.uvexplorerClient.listDevices(
                this.serverUrl,
                this.sessionGuid,
                deviceListRequest
            );
            addDevicesToCollection(collection, devices);
            await this.sendMessage({
                action: 'listDevices',
                devices: JSON.stringify(devices)
            });
            console.log(`Successfully loaded devices: ${source.getName()}`);
        } catch (e) {
            console.error(e);
        }
    }

    protected async messageFromFrame(message: JsonSerializable) {
        console.log('Received a message from the child.');
        console.log(message);
        if (isLoadNetworkMessage(message)) {
            const source = await this.loadNetwork(message.name, message.network_guid);
            if (source !== undefined) {
                await this.loadDevices(source);
            } else {
                console.error(`Could not load network: ${message.name}`);
            }
        } else if (isSelectedDevicesMessage(message)) {
            console.log(message.devices);
        }
    }
}
