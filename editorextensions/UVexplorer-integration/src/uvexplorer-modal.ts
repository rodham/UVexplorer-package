import { CardBlockProxy, EditorClient, JsonSerializable, Modal, Viewport } from 'lucid-extension-sdk';
import { UVExplorerClient } from './uvexplorer-client';
import { isLoadNetworkMessage } from '../model/message';
import { NetworkRequest } from '../model/uvexplorer-model';

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

    async loadNetwork(networkGuid: string) {
        const networkRequest = new NetworkRequest(networkGuid);
        await this.uvexplorerClient.loadNetwork(this.serverUrl, this.sessionGuid, networkRequest);
        console.log(`Successfully loaded network: ${networkGuid}`);
    }

    protected async messageFromFrame(message: JsonSerializable) {
        console.log('Received a message from the child.');
        console.log(message);
        if (isLoadNetworkMessage(message)) {
            await this.loadNetwork(message.network_guid);
            await this.demo(message.network_guid);
        }
    }

    // TODO: Delete this demo code when development continues
    async demo(networkGuid: string) {
        const page = this.viewport.getCurrentPage();
        if (page != undefined) {
            const oldBlocks = page.allBlocks.map((entry) => {
                return entry;
            });
            oldBlocks.forEach((block) => {
                block.delete();
            });

            const { x, y, w, h } = this.viewport.getVisibleRect();
            const center_x = x + w / 2;
            const center_y = y + h / 2;

            //why here?
            const block = page.addBlock({
                className: 'LucidCardBlock',
                boundingBox: {
                    x: center_x,
                    y: center_y,
                    w: w / 30,
                    h: h / 20
                }
            });

            if (block instanceof CardBlockProxy) {
                block.setTitle('Success!');
                block.setDescription(`Loaded network: ${networkGuid}`);
            }
        }
        await this.closeSession();
        this.hide();
    }
}
