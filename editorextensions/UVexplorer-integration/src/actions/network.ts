import { EditorClient } from 'lucid-extension-sdk';
import { DocumentClient } from 'src/doc/document-client';
import { UVExplorerClient } from '@uvx/uvx-client';
import { createTopoMapRequest, defaultLayoutSettings, defaultDrawSettings } from 'model/uvx/topo-map';
import { DataClient } from '@data/data-client';

export async function syncDisplayedMap(docEditor: DocumentClient, client: EditorClient): Promise<void> {
    // TODO: behave differently depending on auto/manual layout and selection
    // For now just redraw the network on the doc with new topoMap request?
    const settings = await client.getPackageSettings();
    const apiKey = settings.get('apiKey');
    const serverUrl = settings.get('serverUrl');
    if (typeof apiKey !== 'string' || typeof serverUrl !== 'string') {
        console.error('Package settings not configured correctly');
        return;
    }
    await redrawMap(docEditor, client);
}

async function redrawMap(docEditor: DocumentClient, client: EditorClient) {
    const uvxClient = UVExplorerClient.getInstance(client);
    const deviceGuids = docEditor.clearMap([]);
    console.log('Device guids for redraw map: ', deviceGuids);

    const data = DataClient.getInstance(client);
    const collection = data.createOrRetrieveSettingsCollection();
    const page = docEditor.getPageId();
    let layoutSettings = defaultLayoutSettings;
    let drawSettings = defaultDrawSettings;
    if (page !== undefined) {
        layoutSettings = data.getLayoutSettings(collection, page);
        drawSettings = data.getDrawSettings(collection, page);
    }

    const topoMapRequest = createTopoMapRequest(deviceGuids, layoutSettings, drawSettings);
    const topoMap = await uvxClient.getTopoMap(topoMapRequest);
    await docEditor.drawMap(topoMap, client);
}
