import { DataSourceProxy, EditorClient, JsonObject, JsonSerializable, Modal, SerializedDataError, SerializedFieldType, Viewport, isJsonSerializable } from 'lucid-extension-sdk';
import { UVExplorerClient } from './uvexplorer-client';
import { isLoadNetworkMessage } from '../model/message';
import { DeviceListRequest, NetworkRequest } from '../model/uvexplorer-model';
import {
    addDevicesToCollection,
    createOrRetrieveDeviceCollection,
    createOrRetrieveNetworkSource,
    deviceToRecord
} from './data-collections';
import { NetworkDeviceBlock } from './network-device-block';

export class UVexplorerModal extends Modal {
    private viewport: Viewport;
    private uvexplorerClient: UVExplorerClient;
    private serverUrl = '';
    private apiKey = '';
    private sessionGuid = '';

    constructor(client: EditorClient, viewport: Viewport) {
        super(client, {
            title: 'UVexplorer',
            width: 800,
            height: 600,
            url: 'http://localhost:4200/networks'
        });

        this.viewport = viewport;
        this.uvexplorerClient = new UVExplorerClient(client);
    }

    public async configureSetting(setting: string) {
        let settings = await this.client.getPackageSettings();
        if (!settings.get(setting)) {
            if (await this.client.canEditPackageSettings()) {
                await this.client.alert(
                    `You have not configured the ${setting}. You will now be prompted to complete that configuration.`
                );
                await this.client.showPackageSettingsModal();
                settings = await this.client.getPackageSettings();
                if (!settings.get(setting)) {
                    return;
                }
            } else {
                await this.client.alert(
                    `Your account has not configured the ${setting}. Talk with your Lucid account administrator to complete configuration.`
                );
            }
        }
    }

    public async loadSettings() {
        const settings = await this.client.getPackageSettings();
        const apiKey = settings.get('apiKey');
        const serverUrl = settings.get('serverUrl');

        if (typeof apiKey == 'string' && typeof serverUrl == 'string') {
            this.apiKey = apiKey;
            this.serverUrl = serverUrl;
        }
    }

    async openSession() {
        this.sessionGuid = await this.uvexplorerClient.openSession(this.serverUrl, this.apiKey);
        console.log(`Successfully opened a session: ${this.sessionGuid}`);
    }

    async closeSession() {
        await this.uvexplorerClient.closeSession(this.serverUrl, this.sessionGuid);
        console.log(`Successfully closed the session.`);
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

    private findCategory(deviceTypes: Set<string>) {
        let orderedPrimaryCategories = [
            'net-device',
            'firewall',
            'router',
            'switch',
            'printer',
            'wireless-controller',
            'wireless-ap',
            'virtual-server',
            'virtual-switch',
            'virtual-port-group',
            'ip-phone',
            'ip-phone-manager',
            'server',
            'workstation',
            'windows',
            'windows-server',
            'ip_camera_cctv',
            'virtual-port-group',
            'wireless-client'
        ];

        for (const category of orderedPrimaryCategories) {
            if (deviceTypes.has(category)) {
                return category;
            }
        }

        return "unknown-device";
    }

    async createDeviceMap() {
        const deviceListRequest = new DeviceListRequest();
        const devices = await this.uvexplorerClient.listDevices(this.serverUrl, this.sessionGuid, deviceListRequest);

        devices.forEach(device => {
            const info_sets = JSON.parse(JSON.stringify(device.info_sets));
            let company = "unknown-make";
            if (info_sets.product_info != undefined) {
                company = info_sets.product_info.vendor;
            }

            const deviceTypes: Set<string> = new Set();
            device["device_categories"]["entries"].forEach(type => {
                deviceTypes.add(type["device_category"]);
            });

            const deviceType = this.findCategory(deviceTypes);

            this.createDeviceShape(company, deviceType);
        });
        
        console.log("Created device map");
    }

    async createDeviceShape(company: string, deviceType: string) {
        const newBlock = new NetworkDeviceBlock("0", this.client);
        await newBlock.createCustomBlock(company, deviceType);
    }

    protected async messageFromFrame(message: JsonSerializable) {
        console.log('Received a message from the child.');
        console.log(message);
        if (isLoadNetworkMessage(message)) {
            const source = await this.loadNetwork(message.name, message.network_guid);
            await this.loadDevices(source);

            await this.createDeviceMap();
        }
    }
}
