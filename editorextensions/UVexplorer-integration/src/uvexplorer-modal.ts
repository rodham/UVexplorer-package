import { EditorClient, JsonSerializable, Modal } from 'lucid-extension-sdk';
import { UVExplorerClient } from './uvexplorer-client';
import { isLoadNetworkMessage } from '../model/iframe-message';
import { NetworkRequest } from '../model/uvexplorer-model';

export class UVexplorerModal extends Modal {
    private uvexplorerClient: UVExplorerClient;
    private serverUrl = '';
    private apiKey = '';
    private sessionGuid = '';

    constructor(client: EditorClient) {
        super(client, {
            title: 'UVexplorer',
            width: 800,
            height: 600,
            url: 'http://localhost:4200/networks'
        });

        this.uvexplorerClient = new UVExplorerClient(client);
    }

    public async configureSetting(setting: string) {
        let settings = await this.client.getPackageSettings();
        if (!settings.get(setting)) {
            if (await this.client.canEditPackageSettings()) {
                await this.client.alert(
                    `You have not configured your ${setting}. You will now be prompted to complete that configuration.`,
                );
                await this.client.showPackageSettingsModal();
                settings = await this.client.getPackageSettings();
                if (!settings.get(setting)) {
                    return;
                }
            } else {
                await this.client.alert(
                    `Your account has not configured your ${setting}. Talk with your Lucid account administrator to complete configuration.`,
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
        console.log(`apikey: ${this.apiKey}, serverUrl: ${this.serverUrl}`)
    }

    async openSession() {
        this.sessionGuid = await this.uvexplorerClient.openSession(this.serverUrl, this.apiKey);
        console.log('Successfully opened a session');
    }

    async listNetworks() {
        const networks = await this.uvexplorerClient.listNetworks(this.serverUrl, this.sessionGuid);
        await this.sendMessage({
            action: 'listNetworks',
            network_summaries: JSON.stringify(networks)
        })
    }

    protected async messageFromFrame(message: JsonSerializable) {
        console.log('Received a message from the child.')
        console.log(message)
        if (isLoadNetworkMessage(message)) {
            console.log('It was a LoadNetworkMessage.')
            const networkGuid = message.network_guid;
            const networkRequest = new NetworkRequest(networkGuid);
            await this.uvexplorerClient.loadNetwork(this.serverUrl,this.sessionGuid, networkRequest);
            console.log('Successfully loaded a network');
        }
    }
}
