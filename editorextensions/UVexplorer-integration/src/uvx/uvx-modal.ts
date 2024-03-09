import { EditorClient, Modal } from 'lucid-extension-sdk';
import { UVExplorerClient } from './uvx-client';
import { NetworkRequest } from 'model/uvx/network';
import { createTopoMapRequest, LayoutType, TopoMap } from 'model/uvx/topo-map';
import { Data } from '@data/data';
import { DocumentEditor } from 'src/doc/documentEditor';

export abstract class UVXModal extends Modal {
    protected docEditor: DocumentEditor;
    protected uvxClient: UVExplorerClient;
    protected data: Data;
    protected serverUrl = '';
    protected apiKey = '';
    protected sessionGuid = '';

    constructor(client: EditorClient, docEditor: DocumentEditor, path: string) {
        super(client, {
            title: 'UVexplorer',
            width: 800,
            height: 600,
            url: `http://localhost:4200/${path}`
        });

        this.uvxClient = UVExplorerClient.getInstance(client);
        this.docEditor = docEditor;
        this.data = Data.getInstance(client);
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
        const networkGuid = this.docEditor.getPageNetworkGuid();
        if (!networkGuid) {
            console.error('Unable to get networkGuid');
            return;
        }
        const networkRequest = new NetworkRequest(networkGuid);
        await this.uvxClient.loadNetwork(networkRequest);
    }

    async loadTopoMap(deviceGuids: string[], layoutType: LayoutType): Promise<TopoMap | undefined> {
        try {
            const topoMapRequest = createTopoMapRequest(deviceGuids, layoutType);
            return await this.uvxClient.getTopoMap(topoMapRequest);
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    /**
     * TopoMap TopoMap
     * @param devices New device guids to be drawn on the map.
     * @param removeDevices Device guids to be removed from the map.
     */
    async drawMap(devices: string[], autoLayout: boolean, removeDevices?: string[]): Promise<void> {
        let topoMap: TopoMap | undefined = undefined;

        if (autoLayout) {
            const deviceGuids = this.docEditor.clearMap(devices, removeDevices);
            topoMap = await this.loadTopoMap(deviceGuids, LayoutType.Hierarchical)
        } else {
            this.docEditor.removeBlocksAndLines(removeDevices);
            if (devices.length > 0) {
                topoMap = await this.loadTopoMap(devices, LayoutType.Manual);
            } else {
                return;
            }
        }

        if (topoMap) {
            await this.docEditor.drawMap(topoMap, this.client);
        } else {
            console.error('Could not load topo map data.');
        }
    }
}
