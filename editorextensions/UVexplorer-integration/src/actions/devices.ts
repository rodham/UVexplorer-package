import { ConnectedDevicesModal } from '@uvx/connected-devices-modal';
import { EditorClient, Viewport } from 'lucid-extension-sdk';
import { isNetworkDeviceBlock } from '@blocks/block-utils';

export function uvDeviceSelected(viewport: Viewport): boolean {
    const selection = viewport.getSelectedItems();
    const isCorrectSelection = selection.length > 0 && selection.every((item) => isNetworkDeviceBlock(item));
    console.log('Should show menu item', isCorrectSelection);
    return isCorrectSelection;
}

export async function showConnectedDevices(viewport: Viewport, client: EditorClient): Promise<void> {
    const selection = viewport.getSelectedItems();
    // TODO: add the connected devices for each of the selected items
    // TODO: for now just show modal using the client and then load devices connected to a test device or two
    console.log('Selection:', selection);
    const deviceGuids = ['cabee6b1-3254-4951-b764-2982fb1b70b0', '65039353-f761-43b9-8d3c-ec60cf5163ee'];

    const modal = new ConnectedDevicesModal(client, viewport, deviceGuids);

    const additionalSettings: Map<string, string> = new Map<string, string>();
    additionalSettings.set('apiKey', '4aff2a87-e76a-4fbc-a699-7c6db610cd88');
    additionalSettings.set('serverUrl', 'https://server.uvexplorer.com:5189');
    await client.setPackageSettings(additionalSettings);

    await modal.loadSettings();
    await modal.show();
    await modal.openSession();
    await modal.loadConnectedDevices();
}
