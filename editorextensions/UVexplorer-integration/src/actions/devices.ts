import { BlockProxy, Viewport } from 'lucid-extension-sdk';

export function uvDeviceSelected(viewport: Viewport): boolean {
    console.log('In uvDeviceSelected');
    const selection = viewport.getSelectedItems();
    // TODO: check if instance of uvDevice class
    const isCorrectSelection = selection.length > 0 && selection.every((item) => item instanceof BlockProxy);
    console.log('Should show menu item', isCorrectSelection);
    return isCorrectSelection;
}

export function showConnectedDevices(viewport: Viewport): void {
    const selection = viewport.getSelectedItems();
    // TODO: add the connected devices for each of the selected items
    console.log('Selection:', selection);
}
