import { BlockProxy, EditorClient, Viewport } from 'lucid-extension-sdk';

export function uvDeviceSelected(viewport: Viewport): boolean {
    console.log('In uvDeviceSelected');
    const selection = viewport.getSelectedItems();
    // TODO: check if instance of uvDevice class
    const isCorrectSelection = selection.length > 0 && selection.every((item) => item instanceof BlockProxy);
    console.log('Should show menu item', isCorrectSelection);
    return isCorrectSelection;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function showConnectedDevices(viewport: Viewport, client: EditorClient): void {
    const selection = viewport.getSelectedItems();
    // TODO: add the connected devices for each of the selected items
    // TODO: for now just show modal using the client and then load devices connected to a test device or two
    console.log('Selection:', selection);
}
