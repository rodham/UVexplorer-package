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
import { populateMapDisplayEdges } from 'model/uvx/display-edge-set';
import { DeviceListRequest } from 'model/uvx/device';

/**
 * Syncs current map drawn within LucidChart with most current data from UVExplorer.
 * @param docEditor DocumentClient
 * @param client EditorClient
 * @returns Promise<void>
 */
export async function syncDisplayedMap(client: EditorClient, docEditor: DocumentClient, uvxClient: UVExplorerClient, data: DataClient): Promise<void> {
    const settings = await client.getPackageSettings();
    const apiKey = settings.get('apiKey');
    const serverUrl = settings.get('serverUrl');
    if (typeof apiKey !== 'string' || typeof serverUrl !== 'string') {
        console.error('Package settings not configured correctly');
        return;
    }
    await refreshMapDevices(client, docEditor, uvxClient, data);
}

/**
 * Redraws network map with most current data from UVExplorer.
 * @param docEditor DocumentClient
 * @param client EditorClient
 * @param uvxClient UVExplorerClient
 * @param data DataClient
 */
async function refreshMapDevices(client: EditorClient, docEditor: DocumentClient, uvxClient: UVExplorerClient, data: DataClient) {
    const networkGuid = docEditor.getPageNetworkGuid();
    if (!networkGuid) throw Error('Unable to get network guid for page');
    const layoutType = docEditor.getLayoutSettings().layoutType;
    const networkRequest = new NetworkRequest(networkGuid);
    await uvxClient.loadNetwork(networkRequest);

    const deviceFilter = docEditor.getDeviceFilter();

    // const deviceGuids = docEditor.getNetworkDeviceBlockGuids();
    let deviceGuids;
    if (deviceFilter !== undefined) {
        const deviceListRequest = new DeviceListRequest(deviceFilter);
        const devices = await uvxClient.listDevices(deviceListRequest);
        const updatedDeviceGuidList = devices.map((device) => device.guid);

        if (layoutType === LayoutType.Manual) {
            const previousDeviceGuids = docEditor.getNetworkDeviceBlockGuids();

            const deviceGuidsNoLongerInNetwork = previousDeviceGuids.filter(
                (oldDevice) => !updatedDeviceGuidList.includes(oldDevice)
            );
            docEditor.removeFromMap(deviceGuidsNoLongerInNetwork);

            const newlyAddedDeviceGuids = updatedDeviceGuidList.filter(
                (device) => !previousDeviceGuids.includes(device)
            );
            deviceGuids = newlyAddedDeviceGuids;
        } else {
            docEditor.clearMap([]);
            deviceGuids = updatedDeviceGuidList;
        }
    } else {
        if (layoutType === LayoutType.Manual) {
            deviceGuids = docEditor.getNetworkDeviceBlockGuids();
        } else {
            deviceGuids = docEditor.clearMap([]);
        }
    }
    console.log('Device guids for redraw map: ', deviceGuids);

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

    populateMapDisplayEdges(topoMap);
    if (topoMap.displayEdges) {
        if (page) {
            data.saveDisplayEdges(data.getNetworkForPage(page), topoMap.displayEdges);
        }
    }

    // docEditor.updateItemsInfo(topoMap);
    if (layoutType === LayoutType.Manual) {
        console.log('Refreshing manual layout');
        docEditor.updateItemsInfo(topoMap, imageSettings);
    } else {
        await docEditor.drawMap(topoMap, client, imageSettings, data);
    }
}

/**
 * Checks if a network is already loaded on the current page.
 * @param docEditor DocumentClient
 * @returns boolean
 */
export function pageHasNetwork(docEditor: DocumentClient) {
    const networkGuid = docEditor.getPageNetworkGuid();
    console.log('Page network guid exists: ', !!networkGuid);
    return !!networkGuid;
}
