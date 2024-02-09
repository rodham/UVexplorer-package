import { EditorClient, Modal } from 'lucid-extension-sdk';
import { UVExplorerClient } from './uvx-client';

export abstract class UVXModal extends Modal {
    protected uvexplorerClient: UVExplorerClient;
    protected serverUrl = '';
    protected apiKey = '';
    protected sessionGuid = '';

    constructor(client: EditorClient) {
        super(client, {
            title: 'UVexplorer',
            width: 800,
            height: 600,
            url: 'http://localhost:4200/networks'
        });

        this.uvexplorerClient = new UVExplorerClient(client);
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
}
