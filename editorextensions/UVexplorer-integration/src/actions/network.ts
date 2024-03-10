import { EditorClient } from 'lucid-extension-sdk';
import { DocumentEditor } from 'src/doc/documentEditor';
import { UVExplorerClient } from '@uvx/uvx-client';
import { createTopoMapRequest } from 'model/uvx/topo-map';
import { NetworkRequest } from 'model/uvx/network';

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
    const networkGuid = docEditor.getPageNetworkGuid();
    if (!networkGuid) throw Error('Unable to get network guid for page');
    const networkRequest = new NetworkRequest(networkGuid);
    await uvxClient.loadNetwork(networkRequest);
    const deviceGuids = docEditor.clearMap([]);
    console.log('Device guids for redraw map: ', deviceGuids);
    const topoMapRequest = createTopoMapRequest(deviceGuids);
    const topoMap = await uvxClient.getTopoMap(topoMapRequest);
    await docEditor.drawMap(topoMap, client);
}

export function pageHasNetwork(docEditor: DocumentEditor) {
    const networkGuid = docEditor.getPageNetworkGuid();
    console.log('Page network guid exists: ', !!networkGuid);
    return !!networkGuid;
}
