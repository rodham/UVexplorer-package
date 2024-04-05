import { DataSourceProxy, EditorClient, JsonSerializable } from 'lucid-extension-sdk';
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

    async sendNetworks(relisting: boolean) {
        try {
            const networks = await this.uvxClient.listNetworks();
            const filteredNetworks = networks.filter((n) => n.name !== '');
            console.log('Successfully retrieved network list.');

            const networkGuid = this.docClient.getPageNetworkGuid();
            if (!relisting && networkGuid) {
                const networkName = filteredNetworks.filter((n) => n.guid === networkGuid)[0].name;
                const source = await this.loadNetwork(networkName, networkGuid);

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

    async loadNetwork(name: string, guid: string): Promise<DataSourceProxy | undefined> {
        try {
            const networkRequest = new NetworkRequest(guid);
            await this.uvxClient.loadNetwork(networkRequest);
            const source = this.docClient.getNetworkSource(name, guid);
            return source;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async sendDevices(source: DataSourceProxy, networkName: string) {
        try {
            const deviceListRequest = new DeviceListRequest();
            const devices = await this.uvxClient.listDevices(deviceListRequest);

            this.dataClient.saveDevices(source, devices);
            const devicesShown = this.docClient.getNetworkDeviceBlockGuids();

            await this.sendMessage({
                action: 'listDevices',
                devices: JSON.stringify(devices),
                visibleConnectedDeviceGuids: JSON.stringify(devicesShown),
                networkName: networkName,
                backButton: true
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
            await this.dynamicDrawMap(message.filter);
            await this.closeSession();
            this.hide();
        } else {
            console.log('Message not recognized');
        }
    }
}
