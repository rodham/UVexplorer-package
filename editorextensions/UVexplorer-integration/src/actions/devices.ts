import { ConnectedDevicesModal } from '@uvx/connected-devices-modal';
import { EditorClient, ItemProxy, Viewport } from 'lucid-extension-sdk';
import { isNetworkDeviceBlock } from '@blocks/block-utils';

export function uvDeviceSelected(viewport: Viewport): boolean {
    const selection = viewport.getSelectedItems();
    const isCorrectSelection = selection.length > 0 && selection.every((item) => isNetworkDeviceBlock(item));
    return isCorrectSelection;
}

export async function showConnectedDevices(viewport: Viewport, client: EditorClient): Promise<void> {
    const selection = viewport.getSelectedItems();
    console.log('Selection:', selection);
    const deviceGuids: string[] = [];
    const visConnDeviceGuids: string[] = [];

    for (const item of selection) {
        if (isNetworkDeviceBlock(item)) {
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
                    !isNetworkDeviceBlock(endpoint1) ||
                    !endpoint2 ||
                    !(endpoint2 instanceof ItemProxy) ||
                    !isNetworkDeviceBlock(endpoint2)
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

    const modal = new ConnectedDevicesModal(client, viewport, deviceGuids, visConnDeviceGuids);

    const additionalSettings: Map<string, string> = new Map<string, string>();
    additionalSettings.set('apiKey', process.env.UVX_API_KEY!);
    additionalSettings.set('serverUrl', process.env.UVX_BASE_URL!);
    await client.setPackageSettings(additionalSettings);

    await modal.loadSettings();
    await modal.openSession();
    await modal.show();
    await modal.loadConnectedDevices();
}
