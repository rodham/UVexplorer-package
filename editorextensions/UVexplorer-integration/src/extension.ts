// import 'dotenv/config';
import { EditorClient, Menu, Viewport } from 'lucid-extension-sdk';
import { DevicesModal } from '@uvx/devices-modal';
import { showConnectedDevices, singleDeviceSelected, uvDeviceSelected, viewDeviceDetails } from '@actions/devices';

const client = new EditorClient();
const menu = new Menu(client);
const viewport: Viewport = new Viewport(client);

client.registerAction('uvDeviceSelected', () => {
    return uvDeviceSelected(viewport);
});

client.registerAction('singleDeviceSelected', () => {
    return singleDeviceSelected(viewport);
});

client.registerAction('showConnectedDevices', async () => await showConnectedDevices(viewport, client));

client.registerAction('viewDeviceDetails', async () => await viewDeviceDetails(viewport, client));

menu.addContextMenuItem({
    label: 'Add/Remove Connected Devices',
    action: 'showConnectedDevices',
    visibleAction: 'uvDeviceSelected'
});

menu.addContextMenuItem({
    label: 'View Device Details',
    action: 'viewDeviceDetails',
    visibleAction: 'singleDeviceSelected'
});

client.registerAction('loadNetwork', async () => {
    const modal = new DevicesModal(client, viewport);

    // TODO: Add back when deploying. Package settings config did not save locally.
    // await modal.configureSetting('apiKey');
    // await modal.configureSetting('serverUrl');

    const additionalSettings: Map<string, string> = new Map<string, string>();
    additionalSettings.set('apiKey', process.env.UVX_API_KEY!);
    additionalSettings.set('serverUrl', process.env.UVX_BASE_URL!);

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
