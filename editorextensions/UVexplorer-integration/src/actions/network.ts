import { EditorClient } from 'lucid-extension-sdk';
import { DocumentClient } from 'src/doc/document-client';
import { UVExplorerClient } from '@uvx/uvx-client';
import { NetworkRequest } from 'model/uvx/network';
import {
    createTopoMapRequest,
    defaultLayoutSettings,
    defaultDrawSettings,
    LayoutType,
    defaultImageSettings
} from 'model/uvx/topo-map';
import { DataClient } from '@data/data-client';

export async function syncDisplayedMap(docEditor: DocumentClient, client: EditorClient): Promise<void> {
    const settings = await client.getPackageSettings();
    const apiKey = settings.get('apiKey');
    const serverUrl = settings.get('serverUrl');
    if (typeof apiKey !== 'string' || typeof serverUrl !== 'string') {
        console.error('Package settings not configured correctly');
        return;
    }
    await refreshMapDevices(docEditor, client);
}

async function refreshMapDevices(docEditor: DocumentClient, client: EditorClient) {
    const uvxClient = UVExplorerClient.getInstance(client);
    const networkGuid = docEditor.getPageNetworkGuid();
    if (!networkGuid) throw Error('Unable to get network guid for page');
    const layoutType = docEditor.getLayoutSettings().layoutType;
    const networkRequest = new NetworkRequest(networkGuid);
    await uvxClient.loadNetwork(networkRequest);
    // const deviceGuids = docEditor.getNetworkDeviceBlockGuids();
    let deviceGuids;
    if (layoutType === LayoutType.Manual) {
        deviceGuids = docEditor.getNetworkDeviceBlockGuids();
    } else {
        deviceGuids = docEditor.clearMap([]);
    }
    console.log('Device guids for redraw map: ', deviceGuids);

    const data = DataClient.getInstance(client);
    const collection = data.createOrRetrieveSettingsCollection();
    const page = docEditor.getPageId();
    let layoutSettings = defaultLayoutSettings;
    let drawSettings = defaultDrawSettings;
    let imageSettings = defaultImageSettings;
    if (page) {
        layoutSettings = data.getLayoutSettings(collection, page);
        drawSettings = data.getDrawSettings(collection, page);
        imageSettings = data.getImageSettings(collection, page);
    }

    const topoMapRequest = createTopoMapRequest(deviceGuids, layoutSettings, drawSettings);
    const topoMap = await uvxClient.getTopoMap(topoMapRequest);
    // docEditor.updateItemsInfo(topoMap);
    if (layoutType === LayoutType.Manual) {
        console.log('Refreshing manual layout');
        docEditor.updateItemsInfo(topoMap, imageSettings);
    } else {
        await docEditor.drawMap(topoMap, client, imageSettings);
    }
}

export function pageHasNetwork(docEditor: DocumentClient) {
    const networkGuid = docEditor.getPageNetworkGuid();
    console.log('Page network guid exists: ', !!networkGuid);
    return !!networkGuid;
}
