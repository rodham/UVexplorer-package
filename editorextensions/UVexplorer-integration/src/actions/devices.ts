import { ConnectedDevicesModal } from '@uvx/connected-devices-modal';
import { DeviceDetailModal } from '@uvx/device-detail-modal';
import { BlockUtils } from '@blocks/block-utils';
import { EditorClient, ItemProxy, LineProxy, Viewport } from 'lucid-extension-sdk';
import { LinkInfoModal } from '@uvx/link-info-modal';
import { UVExplorerClient } from '@uvx/uvx-client';

export function uvDeviceSelected(viewport: Viewport): boolean {
    const selection = viewport.getSelectedItems();
    const isCorrectSelection = selection.length > 0 && selection.every((item) => BlockUtils.isNetworkDeviceBlock(item));
    return isCorrectSelection;
}

export function singleDeviceSelected(viewport: Viewport): boolean {
    const selection = viewport.getSelectedItems();
    const isCorrectSelection =
        selection.length === 1 && selection.every((item) => BlockUtils.isNetworkDeviceBlock(item));
    return isCorrectSelection;
}

export function deviceLinkSelected(viewport: Viewport): boolean {
    const selection = viewport.getSelectedItems();
    const isCorrectSelection =
        selection.length === 1 && selection[0] instanceof LineProxy && !!BlockUtils.getLinkInfoFromLine(selection[0]);
    return isCorrectSelection;
}

export async function showConnectedDevices(
    viewport: Viewport,
    client: EditorClient,
    uvxClient: UVExplorerClient
): Promise<void> {
    const selection = viewport.getSelectedItems();
    const deviceGuids: string[] = [];
    const visConnDeviceGuids: string[] = [];

    for (const item of selection) {
        if (BlockUtils.isNetworkDeviceBlock(item)) {
            const itemData = item.shapeData.get('Guid');
            if (itemData && typeof itemData === 'string' && itemData !== '') deviceGuids.push(itemData);
            else {
                console.log('Problem getting shapeData guid from item');
                continue;
            }
            const connectedLines = item.getConnectedLines();
            for (const line of connectedLines) {
                const endpoint1 = line.getEndpoint1().connection;
                const endpoint2 = line.getEndpoint2().connection;
                if (
                    !endpoint1 ||
                    !(endpoint1 instanceof ItemProxy) ||
                    !BlockUtils.isNetworkDeviceBlock(endpoint1) ||
                    !endpoint2 ||
                    !(endpoint2 instanceof ItemProxy) ||
                    !BlockUtils.isNetworkDeviceBlock(endpoint2)
                ) {
                    continue;
                }
                const itemData1 = endpoint1.shapeData.get('Guid');
                const itemData2 = endpoint2.shapeData.get('Guid');

                if (itemData1 && typeof itemData1 === 'string' && itemData1 !== itemData) {
                    visConnDeviceGuids.push(itemData1);
                } else if (itemData2 && typeof itemData2 === 'string' && itemData2 !== itemData) {
                    visConnDeviceGuids.push(itemData2);
                }
            }
        }
    }

    const modal = new ConnectedDevicesModal(client, viewport, uvxClient, deviceGuids, visConnDeviceGuids);

    const additionalSettings: Map<string, string> = new Map<string, string>();
    additionalSettings.set('apiKey', process.env.UVX_API_KEY!);
    additionalSettings.set('serverUrl', process.env.UVX_BASE_URL!);
    await client.setPackageSettings(additionalSettings);

    await modal.loadSettings();
    await modal.openSession();
    await modal.show();
    await modal.loadConnectedDevices();
}

export async function viewDeviceDetails(
    viewport: Viewport,
    client: EditorClient,
    uvxClient: UVExplorerClient
): Promise<void> {
    const selection = viewport.getSelectedItems();
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

    const modal = new DeviceDetailModal(client, viewport, uvxClient, device);

    const additionalSettings: Map<string, string> = new Map<string, string>();
    additionalSettings.set('apiKey', process.env.UVX_API_KEY!);
    additionalSettings.set('serverUrl', process.env.UVX_BASE_URL!);
    await client.setPackageSettings(additionalSettings);

    await modal.loadSettings();
    await modal.openSession();
    await modal.show();
    await modal.getDeviceDetails();
}

export async function viewLinkDetails(
    viewport: Viewport,
    client: EditorClient,
    uvxClient: UVExplorerClient
): Promise<void> {
    const selection = viewport.getSelectedItems();
    if (selection.length !== 1) {
        console.log('Can only view details of one link at a time');
        return;
    }
    const selectedItem = selection[0];
    if (!(selectedItem instanceof LineProxy)) {
        console.error('Can only view details of LineProxy instance');
        return;
    }
    const line = BlockUtils.getLinkInfoFromLine(selectedItem);

    if (!line) {
        console.error('Unable to get line from selected block');
        return;
    }

    const modal = new LinkInfoModal(client, viewport, uvxClient, line);

    const additionalSettings: Map<string, string> = new Map<string, string>();
    additionalSettings.set('apiKey', process.env.UVX_API_KEY!);
    additionalSettings.set('serverUrl', process.env.UVX_BASE_URL!);
    await client.setPackageSettings(additionalSettings);

    await modal.loadSettings();
    await modal.openSession();
    await modal.show();
    await modal.displayLineDetails();
}
