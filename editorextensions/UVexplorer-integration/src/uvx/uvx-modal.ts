import { EditorClient, Modal } from 'lucid-extension-sdk';
import { UVExplorerClient } from './uvx-client';
import { NetworkRequest } from 'model/uvx/network';
import {
    createTopoMapRequest,
    defaultDrawSettings,
    defaultLayoutSettings,
    DrawSettings,
    LayoutSettings,
    manualLayoutSettings,
    TopoMap
} from 'model/uvx/topo-map';
import { DataClient } from '@data/data-client';
import { DocumentClient } from 'src/doc/document-client';
export abstract class UVXModal extends Modal {
    protected docClient: DocumentClient;
    protected uvxClient: UVExplorerClient;
    protected dataClient: DataClient;
    protected serverUrl = '';
    protected apiKey = '';
    protected sessionGuid = '';

    protected constructor(
        client: EditorClient,
        docClient: DocumentClient,
        uvxClient: UVExplorerClient,
        dataClient: DataClient,
        path: string
    ) {
        super(client, {
            title: 'UVexplorer',
            width: 800,
            height: 600,
            url: `http://localhost:4200/${path}`
        });

        this.uvxClient = uvxClient;
        this.docClient = docClient;
        this.dataClient = dataClient;
    }

    async closeSession() {
        try {
            await this.uvxClient.closeSession();
            console.log(`Successfully closed the session.`);
        } catch (e) {
            console.error(e);
        }
    }

    async loadPageNetwork() {
        const networkGuid = this.docClient.getPageNetworkGuid();
        if (!networkGuid) {
            console.error('Unable to get networkGuid');
            return;
        }
        const networkRequest = new NetworkRequest(networkGuid);
        await this.uvxClient.loadNetwork(networkRequest);
    }

    // Creates and sends the TopoMapRequest with the desired layout and draw settings
    async loadTopoMap(deviceGuids: string[], autoLayout: boolean): Promise<TopoMap | undefined> {
        const collection = this.dataClient.createOrRetrieveSettingsCollection();
        const page = this.docClient.getPageId();

        let layoutSettings = defaultLayoutSettings;
        let drawSettings = defaultDrawSettings;

        if (page) {
            if (autoLayout) {
                layoutSettings = this.dataClient.getLayoutSettings(collection, page);
            } else {
                layoutSettings = manualLayoutSettings;
            }
            drawSettings = this.dataClient.getDrawSettings(collection, page);
        }

        try {
            const topoMapRequest = createTopoMapRequest(deviceGuids, layoutSettings, drawSettings);

            return await this.uvxClient.getTopoMap(topoMapRequest);
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async drawMap(addDevices: string[], autoLayout: boolean, removeDevices?: string[]): Promise<void> {
        let topoMap: TopoMap | undefined = undefined;

        if (autoLayout) {
            // Auto layout
            // Remove all devices
            const remainDevices = this.docClient.clearMap(removeDevices);
            // Redraw new devices with auto layout
            topoMap = await this.loadTopoMap([...addDevices, ...remainDevices], autoLayout);
        } else {
            // Manual layout
            // Remove only unwanted devices
            if (removeDevices) {
                this.docClient.removeFromMap(removeDevices);
            }

            if (addDevices.length > 0) {
                // Draw only the new devices with manual layout
                topoMap = await this.loadTopoMap(addDevices, autoLayout);
            } else {
                return;
            }
        }

        if (topoMap) {
            await this.docClient.drawMap(topoMap, this.client);
        } else {
            console.error('Could not load topo map data.');
        }
    }

    async sendMapSettings() {
        const collection = this.dataClient.createOrRetrieveSettingsCollection();
        const page = this.docClient.getPageId();

        let layoutSettings: LayoutSettings = defaultLayoutSettings;
        let drawSettings: DrawSettings = defaultDrawSettings;
        if (page !== undefined) {
            layoutSettings = this.dataClient.getLayoutSettings(collection, page);
            drawSettings = this.dataClient.getDrawSettings(collection, page);
        }

        try {
            await this.sendMessage({
                action: 'mapSettings',
                drawSettings: JSON.stringify(drawSettings),
                layoutSettings: JSON.stringify(layoutSettings)
            });
        } catch (e) {
            console.error(e);
        }
    }

    saveSettings(drawSettings: DrawSettings, layoutSettings: LayoutSettings) {
        try {
            const page = this.docClient.getPageId();

            if (page !== undefined) {
                const collection = this.dataClient.createOrRetrieveSettingsCollection();
                this.dataClient.deleteSettingsFromCollection(collection, page);
                this.dataClient.addSettingsToCollection(collection, page, layoutSettings, drawSettings);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async reloadDevices() {
        await this.sendMessage({
            action: 'relistDevices'
        });
    }
}
