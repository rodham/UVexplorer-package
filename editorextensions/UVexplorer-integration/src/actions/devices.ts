import { ConnectedDevicesModal } from '@uvx/connected-devices-modal';
import { DeviceDetailModal } from '@uvx/device-detail-modal';
import { BlockUtils } from '@blocks/block-utils';
import { EditorClient, ItemProxy, LineProxy, Viewport } from 'lucid-extension-sdk';
import { LinkInfoModal } from '@uvx/link-info-modal';
import { DocumentClient } from 'src/doc/document-client';
import { UVExplorerClient } from '@uvx/uvx-client';
import { DataClient } from '@data/data-client';

/**
 * Checks that the selected items are our custom NetworkDeviceBlock for add/remove connected devices functionality.
 * @param viewport Viewport
 * @returns boolean
 */
export function uvDeviceSelected(viewport: Viewport): boolean {
    const selection = viewport.getSelectedItems();
    const isCorrectSelection =
        selection.length > 0 &&
        selection.every((item) => BlockUtils.isNetworkDeviceBlock(item)) &&
        selection.some((item) => !BlockUtils.isHubNodeBlock(item));
    return isCorrectSelection;
}

/**
 * Checks that the selected item is our custom NetworkDeviceBlock for device details functionality.
 * @param viewport Viewport
 * @returns boolean
 */
export function singleDeviceSelected(viewport: Viewport): boolean {
    const selection = viewport.getSelectedItems();
    const isCorrectSelection =
        selection.length === 1 &&
        BlockUtils.isNetworkDeviceBlock(selection[0]) &&
        !BlockUtils.isHubNodeBlock(selection[0]);
    return isCorrectSelection;
}

/**
 * Checks that the selected item is a LineProxy for device link details functionality.
 * @param viewport 
 * @returns 
 */
export function deviceLinkSelected(viewport: Viewport): boolean {
    const selection = viewport.getSelectedItems();
    const isCorrectSelection =
        selection.length === 1 &&
        selection[0] instanceof LineProxy &&
        !!BlockUtils.getDisplayEdgeFromLine(selection[0]);
    return isCorrectSelection;
}

/**
 * Opens connected devices modal to display connected devices of all selected NetworkDeviceBlocks.
 * @param selection ItemProxy[]
 * @param client EditorClient
 * @param docEditor DocumentClient
 * @param uvxClient UVExplorerClient
 * @param data DataClient
 */
export async function showConnectedDevices(
    selection: ItemProxy[],
    client: EditorClient,
    docEditor: DocumentClient,
    uvxClient: UVExplorerClient,
    data: DataClient
): Promise<void> {
    const deviceGuids: string[] = [];
    const visConnDeviceGuids: string[] = [];

    for (const item of selection) {
        if (BlockUtils.isNetworkDeviceBlock(item)) {
            const itemData = item.shapeData.get('Guid');
            if (itemData && typeof itemData === 'string' && itemData !== '' && itemData !== 'Hub Node')
                deviceGuids.push(itemData);
            else {
                console.log('Problem getting shapeData guid from item');
                continue;
            }
            visConnDeviceGuids.push(...BlockUtils.getVisibleConnectedDeviceGuidsFromBlock(item));
        }
    }

    const modal = new ConnectedDevicesModal(client, docEditor, uvxClient, data, deviceGuids, visConnDeviceGuids);
    const networkName = await getNetworkName(docEditor, data, uvxClient);

    await modal.show();
    await modal.sendConnectedDevices(networkName);
}

/**
 * Retrieves the network name for the network currently loadedfor a page.
 * @param docEditor DocumentClient
 * @param data DataClient
 * @param uvxClient UVExplorerClient
 * @returns Promise<string>
 */
async function getNetworkName(docEditor: DocumentClient, data: DataClient, uvxClient: UVExplorerClient): Promise<string> {
    const pageId: string = docEditor.getPageId()!;
    const networkGuid = data.getNetworkForPage(pageId);
    const networks = await uvxClient.listNetworks();
    const filteredNetworks = networks.filter((n) => n.name !== '');
    return filteredNetworks.filter((n) => n.guid === networkGuid)[0].name;
}

/**
 * Opens device details modal to display the device details of a selected NetworkDeviceBlock.
 * @param selection ItemProxy[]
 * @param client EditorClient
 * @param docEditor DocumentClient
 * @param uvxClient UVExplorerClient
 * @param data DataClient
 * @returns Promise<void>
 */
export async function viewDeviceDetails(
    selection: ItemProxy[],
    client: EditorClient,
    docEditor: DocumentClient,
    uvxClient: UVExplorerClient,
    data: DataClient
): Promise<void> {
    if (selection.length !== 1) {
        console.log('Can only view details of one device at a time');
        return;
    }
    const selectedItem = selection[0];
    if (!BlockUtils.isNetworkDeviceBlock(selectedItem)) {
        console.log('Can only view details of device shape');
        return;
    }
    const device = BlockUtils.getDeviceFromBlock(selectedItem);

    if (!device) {
        console.error('Unable to get device from selected block');
        return;
    }

    const modal = new DeviceDetailModal(client, docEditor, uvxClient, data, device);

    await modal.show();
    await modal.sendDeviceDetails();
}

/**
 * Opens link info modal to display the link info of a selected link between NetworkDeviceBlocks.
 * @param selection ItemProxy[]
 * @param client EditorClient
 * @param docEditor DocumentClient
 * @param uvxClient UVExplorerClient
 * @param data DataClient
 * @returns Promise<void>
 */
export async function viewLinkDetails(
    selection: ItemProxy[],
    client: EditorClient,
    docEditor: DocumentClient,
    uvxClient: UVExplorerClient,
    data: DataClient
): Promise<void> {
    if (selection.length !== 1) {
        console.log('Can only view details of one link at a time');
        return;
    }
    const selectedItem = selection[0];
    if (!(selectedItem instanceof LineProxy)) {
        console.error('Can only view details of LineProxy instance');
        return;
    }
    const displayEdge = BlockUtils.getDisplayEdgeFromLine(selectedItem);

    if (!displayEdge) {
        console.error('Unable to get line from selected block');
        return;
    }

    const modal = new LinkInfoModal(client, docEditor, uvxClient, data, displayEdge);

    await modal.show();
    await modal.sendLineDetails();
}
