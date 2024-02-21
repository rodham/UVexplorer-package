import { DataSourceProxy, EditorClient, JsonSerializable, Viewport } from 'lucid-extension-sdk';
import { isLoadNetworkMessage, isSelectedDevicesMessage } from 'model/message';
import { DeviceListRequest, NetworkRequest } from 'model/uvexplorer-model';
import { UVXModal } from './uvx-modal';
import { drawBlocks, drawLinks } from '@blocks/block-utils';
import { Data } from '@data/data';

export class DevicesModal extends UVXModal {
    private viewport: Viewport;

    constructor(client: EditorClient, viewport: Viewport) {
        super(client, 'networks');

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
            const data = Data.getInstance(this.client);
            const source = data.createOrRetrieveNetworkSource(name, guid);
            const page = this.viewport.getCurrentPage();
            if (page !== undefined) {
                data.updatePageMap(page.id, guid);
            }
            console.log(`Successfully loaded network: ${name}`);
            return source;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async loadDevices(source: DataSourceProxy) {
        try {
            const data = Data.getInstance(this.client);
            const collection = data.createOrRetrieveDeviceCollection(source);
            const deviceListRequest = new DeviceListRequest();
            const devices = await this.uvexplorerClient.listDevices(
                this.serverUrl,
                this.sessionGuid,
                deviceListRequest
            );
            data.deleteDevicesFromCollection(collection); // TODO: Replace once updateDevicesInCollection Function is implemented
            data.addDevicesToCollection(collection, devices);
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
            const deviceGuids = message.devices.map((d) => d.guid);
            this.hide();
            const topoMap = await this.loadTopoMap(deviceGuids);
            if (topoMap !== undefined) {
                await drawBlocks(this.client, this.viewport, message.devices, topoMap.deviceNodes);
                drawLinks(this.client, this.viewport, topoMap.deviceLinks);
            } else {
                console.error('Could not load topo map data.');
            }
        }
    }
}
