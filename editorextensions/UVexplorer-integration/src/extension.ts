import { EditorClient, Menu, Viewport } from 'lucid-extension-sdk';
import { DevicesModal } from '@uvx/devices-modal';
import { showConnectedDevices, uvDeviceSelected } from '@actions/devices';

const client = new EditorClient();
const menu = new Menu(client);
const viewport: Viewport = new Viewport(client);

client.registerAction('uvDeviceSelected', () => {
    return uvDeviceSelected(viewport);
});

client.registerAction('showConnectedDevices', () => showConnectedDevices(viewport, client));

menu.addContextMenuItem({
    label: 'Show connected devices',
    action: 'showConnectedDevices',
    visibleAction: 'uvDeviceSelected'
});

client.registerAction('loadNetwork', async () => {
    const modal = new DevicesModal(client, viewport);

    // TODO: Add back when deploying. Package settings config did not save locally.
    // await modal.configureSetting('apiKey');
    // await modal.configureSetting('serverUrl');

    const additionalSettings: Map<string, string> = new Map<string, string>();
    additionalSettings.set('apiKey', '4aff2a87-e76a-4fbc-a699-7c6db610cd88');
    additionalSettings.set('serverUrl', 'https://server.uvexplorer.com:5189');
    await client.setPackageSettings(additionalSettings);

    await modal.loadSettings();
    await modal.openSession();
    await modal.show();
    await modal.listNetworks();
});

menu.addDropdownMenuItem({
    label: 'Load a Network',
    action: 'loadNetwork'
});

async function init() {
    await client.loadBlockClasses(['NetworkDeviceBlock']);
}

void init();
