import { DataSourceProxy, EditorClient, JsonSerializable, Modal, Viewport } from 'lucid-extension-sdk';
import { UVExplorerClient } from './uvexplorer-client';
import { isLoadNetworkMessage } from '../model/message';
import { DeviceListRequest, NetworkRequest } from '../model/uvexplorer-model';
import {
    addDevicesToCollection,
    createOrRetrieveDeviceCollection,
    createOrRetrieveNetworkSource
} from './data-collections';

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
        try {
            this.sessionGuid = await this.uvexplorerClient.openSession(this.serverUrl, this.apiKey);
            console.log(`Successfully opened a session: ${this.sessionGuid}`);
        } catch (e) {
            console.error(e);
        }
    }

    async closeSession() {
        try {
            await this.uvexplorerClient.closeSession(this.serverUrl, this.sessionGuid);
            console.log(`Successfully closed the session.`);
        } catch (e) {
            console.error(e);
        }
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
        }
    }
}
