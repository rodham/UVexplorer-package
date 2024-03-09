import { DataSourceProxy, EditorClient, JsonSerializable } from 'lucid-extension-sdk';
import { isLoadNetworkMessage, isSelectedDevicesMessage } from 'model/message';
import { NetworkRequest } from 'model/uvx/network';
import { Device, DeviceListRequest } from 'model/uvx/device';
import { UVXModal } from './uvx-modal';
import { DocumentEditor } from 'src/doc/documentEditor';

export class DevicesModal extends UVXModal {
    constructor(client: EditorClient, docEditor: DocumentEditor) {
        super(client, docEditor, 'networks');
    }

    async listNetworks() {
        try {
            const networks = await this.uvxClient.listNetworks();
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
            await this.uvxClient.loadNetwork(networkRequest);
            const source = this.docEditor.getNetworkSource(name, guid);
            return source;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async loadDevices(source: DataSourceProxy) {
        try {
            const deviceListRequest = new DeviceListRequest();
            const devices = await this.uvxClient.listDevices(deviceListRequest);

            this.saveDevices(source, devices);
            const devicesShown = this.docEditor.getCurrentPageItems();

            await this.sendMessage({
                action: 'listDevices',
                devices: JSON.stringify(devices),
                visibleConnectedDeviceGuids: JSON.stringify(devicesShown),
                forcedAutoLayout: false
            });
            console.log(`Successfully loaded devices: ${source.getName()}`);
        } catch (e) {
            console.error(e);
        }
    }

    saveDevices(source: DataSourceProxy, devices: Device[]) {
        const collection = this.data.createOrRetrieveDeviceCollection(source);
        this.data.clearCollection(collection); // TODO: Replace once updateDevicesInCollection Function is implemented
        this.data.addDevicesToCollection(collection, devices);
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
            console.log('Received isSelectedDevicesMessage')
            await this.drawMap(message.devices, message.autoLayout, message.removeDevices);
            await this.closeSession();
            this.hide();
        }
    }
}
