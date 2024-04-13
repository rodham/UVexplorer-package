import { CollectionProxy, DataSourceProxy, EditorClient, JsonSerializable } from 'lucid-extension-sdk';
import {
    isDeviceFilterMessage,
    isLoadMapSettingsMessage,
    isLoadNetworkMessage,
    isRelistNetworksMessage,
    isSelectedDevicesMessage,
    isSelectedMapSettingsMessage
} from 'model/message';
import { NetworkRequest } from 'model/uvx/network';
import { DeviceListRequest } from 'model/uvx/device';
import { UVXModal } from './uvx-modal';
import { DocumentClient } from 'src/doc/document-client';
import { UVExplorerClient } from '@uvx/uvx-client';
import { DataClient } from '@data/data-client';

export class DevicesModal extends UVXModal {
    constructor(client: EditorClient, docEditor: DocumentClient, uvxClient: UVExplorerClient, dataClient: DataClient) {
        super(client, docEditor, uvxClient, dataClient, 'networks');
    }

    /*
     * This function will either display a list of all networks for the user to choose from or call the functions needed
     * to obtain and display a list of devices on the previously selected network
     */
    async sendNetworks(relisting: boolean) {
        try {
            const networks = await this.uvxClient.listNetworks();
            const filteredNetworks = networks.filter((n) => n.name !== '');
            console.log('Successfully retrieved network list.');

            const networkGuid = this.docClient.getPageNetworkGuid();
            if (!relisting && networkGuid) {
                const networkName = filteredNetworks.filter((n) => n.guid === networkGuid)[0].name;
                const source = await this.loadNetwork(networkGuid, networkName);

                if (!source) {
                    console.error(`Could not load network: ${networkName}`);
                    return;
                }

                console.log('Sending devices from auto loading network');
                await this.sendDevices(source, networkName);
            } else {
                await this.sendMessage({
                    action: 'listNetworks',
                    network_summaries: JSON.stringify(filteredNetworks)
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    /*
     * This function causes the UVX API to load a specific network to be queried for devices. It will then return the
     * source associated with that network.
     */
    async loadNetwork(guid: string, name?: string): Promise<DataSourceProxy | undefined> {
        try {
            const networkRequest = new NetworkRequest(guid);
            await this.uvxClient.loadNetwork(networkRequest);
            const source = this.docClient.getNetworkSource(guid, name);
            return source;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    /*
     * This function takes in a data source and network name. It then retrieves all the devices for that network,
     * stores them in the source, then sends a message to display the devices in the devices component
     */
    async sendDevices(source: DataSourceProxy, networkName: string) {
        try {
            const deviceListRequest = new DeviceListRequest();
            const devices = await this.uvxClient.listDevices(deviceListRequest);

            this.dataClient.saveDevices(source, devices);
            const devicesShown = this.docClient.getNetworkDeviceBlockGuids();

            const filter = this.docClient.getDeviceFilter();
            console.log('Curr device filter to send: ', filter);

            await this.sendMessage({
                action: 'listDevices',
                devices: JSON.stringify(devices),
                visibleConnectedDeviceGuids: JSON.stringify(devicesShown),
                networkName: networkName,
                backButton: true,
                dynSelectFilter: filter ? JSON.stringify(filter) : undefined
            });
            console.log(`Successfully loaded devices: ${source.getName()}`);
        } catch (e) {
            console.error(e);
        }
    }

    /*
     * This function is a function that is called anytime a message is sent by a component. It receives those messages
     * and calls the appropriate actions.
     */
    protected async messageFromFrame(message: JsonSerializable) {
        console.log('Received a message from the child.');
        console.log(message);
        if (isLoadNetworkMessage(message)) {
            const source = await this.loadNetwork(message.network_guid, message.name);
            if (source !== undefined) {
                await this.sendDevices(source, message.name);
            } else {
                console.error(`Could not load network: ${message.name}`);
            }
        } else if (isSelectedDevicesMessage(message)) {
            console.log('Received isSelectedDevicesMessage');
            await this.drawMap(message.devices, message.removeDevices);
            await this.closeSession();
            this.hide();
        } else if (isLoadMapSettingsMessage(message)) {
            await this.sendMapSettings(true);
        } else if (isSelectedMapSettingsMessage(message)) {
            this.docClient.saveSettings(message.drawSettings, message.layoutSettings, message.imageSettings);
            await this.reloadDevices();
        } else if (isRelistNetworksMessage(message)) {
            await this.sendNetworks(true);
        } else if (isDeviceFilterMessage(message)) {
            console.log('Device Filter message recieved');
            const collection: CollectionProxy = this.dataClient.createOrRetrieveDeviceFilterCollection();
            const pageId = this.docClient.getPageId();
            if (pageId) {
                this.dataClient.deleteSettingsFromCollection(collection, pageId);
                this.dataClient.addDeviceFilterToCollection(collection, pageId, true, message.filter);
            }
            await this.dynamicDrawMap(message.filter);
            await this.closeSession();
            this.hide();
        } else {
            console.log('Message not recognized');
        }
    }
}
