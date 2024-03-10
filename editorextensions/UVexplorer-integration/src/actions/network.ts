import { EditorClient } from 'lucid-extension-sdk';
import { DocumentEditor } from 'src/doc/documentEditor';
import { UVExplorerClient } from '@uvx/uvx-client';
import { LayoutType, createTopoMapRequest } from 'model/uvx/topo-map';

export async function syncDisplayedMap(docEditor: DocumentEditor, client: EditorClient): Promise<void> {
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

async function redrawMap(docEditor: DocumentEditor, client: EditorClient) {
    const uvxClient = UVExplorerClient.getInstance(client);
    const deviceGuids = docEditor.clearMap([]);
    console.log('Device guids for redraw map: ', deviceGuids);
    const topoMapRequest = createTopoMapRequest(deviceGuids, LayoutType.Manual);
    const topoMap = await uvxClient.getTopoMap(topoMapRequest);
    await docEditor.drawMap(topoMap, client);
}
