import { DataSourceProxy, EditorClient, JsonSerializable, Viewport } from 'lucid-extension-sdk';
import {
    isLoadMapSettingsMessage,
    isLoadNetworkMessage,
    isSelectedDevicesMessage, 
    isSelectedMapSettingsMessage
} from 'model/message';
import { NetworkRequest } from 'model/uvexplorer-model';
import { Device, DeviceListRequest } from 'model/uvexplorer-devices-model';
import { UVXModal } from './uvx-modal';
import { DrawSettings, LayoutSettings, defaultDrawSettings, defaultLayoutSettings } from 'model/uvexplorer-topomap-model';

export class DevicesModal extends UVXModal {
    constructor(client: EditorClient, viewport: Viewport) {
        super(client, viewport, 'networks');

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
            const source = this.data.createOrRetrieveNetworkSource(name, guid);
            const page = this.viewport.getCurrentPage();
            if (page !== undefined) {
                this.data.updatePageMap(page.id, guid);
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
            const deviceListRequest = new DeviceListRequest();
            const devices = await this.uvexplorerClient.listDevices(
                this.serverUrl,
                this.sessionGuid,
                deviceListRequest
            );

            this.saveDevices(source, devices);

            await this.sendMessage({
                action: 'listDevices',
                devices: JSON.stringify(devices)
            });
            console.log(`Successfully loaded devices: ${source.getName()}`);
        } catch (e) {
            console.error(e);
        }
    }

    async reloadDevices() {
        await this.sendMessage({
            action: 'relistDevices'
        });
    }

    saveDevices(source: DataSourceProxy, devices: Device[]) {
        const collection = this.data.createOrRetrieveDeviceCollection(source);
        this.data.deleteDevicesFromCollection(collection); // TODO: Replace once updateDevicesInCollection Function is implemented
        this.data.addDevicesToCollection(collection, devices);
    }

    async loadMapSettings() {
        const collection = this.data.createOrRetrieveSettingsCollection();
        const page = this.viewport.getCurrentPage();

        let layoutSettings = defaultLayoutSettings;
        let drawSettings = defaultDrawSettings;
        if (page !== undefined) {
            layoutSettings = this.data.getLayoutSettings(collection, page.id);
            drawSettings = this.data.getDrawSettings(collection, page.id);
        }

        try {
            await this.sendMessage({
                action: 'mapSettings',
                drawSettings: JSON.stringify(drawSettings)
            });
        } catch (e) {
            console.error(e);
        }
    }

    saveSettings(drawSettings: DrawSettings, layoutSettings: LayoutSettings) {
        try {
            const page = this.viewport.getCurrentPage();

            if (page !== undefined) {
                const collection = this.data.createOrRetrieveSettingsCollection();
                this.data.deleteSettingsFromCollection(collection, page.id);
                this.data.addSettingsToCollection(
                    collection, 
                    page.id, 
                    layoutSettings, 
                    drawSettings
                );
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    protected async messageFromFrame(message: JsonSerializable) {
        console.log('Received a message from the child.');
        console.log(message);
        if (isLoadNetworkMessage(message)) {
            console.log(message.name);
            console.log(message.network_guid);
            const source = await this.loadNetwork(message.name, message.network_guid);
            if (source !== undefined) {
                await this.loadDevices(source);
            } else {
                console.error(`Could not load network: ${message.name}`);
            }
        } else if (isSelectedDevicesMessage(message)) {
            const devices = message.devices.map((d) => d.guid);
            await this.drawMap(devices);
            await this.closeSession();
            this.hide();
        } else if (isLoadMapSettingsMessage(message)) {
            this.loadMapSettings();
        } else if (isSelectedMapSettingsMessage(message)) {
            this.saveSettings(message.drawSettings, message.layoutSettings);
            this.reloadDevices();
        }
    }
}
