import { DataSourceProxy, EditorClient, JsonSerializable } from 'lucid-extension-sdk';
import {
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
    constructor(client: EditorClient, docEditor: DocumentClient, uvxClient: UVExplorerClient, data: DataClient) {
        super(client, docEditor, uvxClient, data, 'networks');
    }

    async sendNetworks(relisting: boolean) {
        try {
            const networks = await this.uvxClient.listNetworks();
            const filteredNetworks = networks.filter((n) => n.name !== '');
            console.log(`Successfully retrieved network list.`);

            const pageId: string = this.docClient.getPageId()!;
            if (!relisting && this.dataClient.checkIfNetworkLoaded(pageId)) {
                const networkGuid = this.dataClient.getNetworkForPage(pageId);
                const networkName = filteredNetworks.filter((n) => n.guid === networkGuid)[0].name;
                const source = await this.loadNetwork(networkName, networkGuid);
                if (source !== undefined) {
                    await this.sendDevices(source, networkName);
                } else {
                    console.error(`Could not load network: ${networkName}`);
                }
            }
            else {
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
                forcedAutoLayout: false
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
            await this.sendMapSettings();
        } else if (isSelectedMapSettingsMessage(message)) {
            this.docClient.saveSettings(message.drawSettings, message.layoutSettings, message.imageSettings);
            await this.reloadDevices();
        } else if (isRelistNetworksMessage(message)) {
            await this.sendNetworks(true);
        }
    }
}
