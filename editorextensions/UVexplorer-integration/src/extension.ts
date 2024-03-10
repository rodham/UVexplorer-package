// import 'dotenv/config';
import { EditorClient, Menu, Viewport } from 'lucid-extension-sdk';
import { DevicesModal } from '@uvx/devices-modal';
import {
    deviceLinkSelected,
    showConnectedDevices,
    singleDeviceSelected,
    uvDeviceSelected,
    viewDeviceDetails,
    viewLinkDetails
} from '@actions/devices';
import { Data } from './data/data';
import { DocumentEditor } from './doc/documentEditor';
import { pageHasNetwork, syncDisplayedMap } from './actions/network';

const client = new EditorClient();
const menu = new Menu(client);
const viewport: Viewport = new Viewport(client);

client.registerAction('uvDeviceSelected', () => {
    return uvDeviceSelected(viewport);
});

client.registerAction('singleDeviceSelected', () => {
    return singleDeviceSelected(viewport);
});

client.registerAction('deviceLinkSelected', () => {
    return deviceLinkSelected(viewport);
});

client.registerAction('showConnectedDevices', async () => {
    await configureClientPackageSettings();
    const selection = viewport.getSelectedItems();
    const docEditor = createDocEditor();
    await showConnectedDevices(selection, client, docEditor);
});

client.registerAction('viewDeviceDetails', async () => {
    await configureClientPackageSettings();
    const selection = viewport.getSelectedItems();
    const docEditor = createDocEditor();
    await viewDeviceDetails(selection, client, docEditor);
});

client.registerAction('viewLinkDetails', async () => {
    await configureClientPackageSettings();
    const selection = viewport.getSelectedItems();
    const docEditor = createDocEditor();
    await viewLinkDetails(selection, client, docEditor);
});

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

menu.addContextMenuItem({
    label: 'View Link Details',
    action: 'viewLinkDetails',
    visibleAction: 'deviceLinkSelected'
});

client.registerAction('loadNetwork', async () => {
    const docEditor = createDocEditor();
    const modal = new DevicesModal(client, docEditor);

    await configureClientPackageSettings();

    await modal.show();
    await modal.listNetworks();
});

client.registerAction('syncDisplayedMap', async () => {
    await configureClientPackageSettings();
    const docEditor = createDocEditor();
    await syncDisplayedMap(docEditor, client);
});

client.registerAction('pageHasNetwork', () => {
    const docEditor = createDocEditor();
    return pageHasNetwork(docEditor);
});

menu.addDropdownMenuItem({
    label: 'Load a Network',
    action: 'loadNetwork'
});

menu.addDropdownMenuItem({
    label: 'Sync Page with UVExplorer',
    action: 'syncDisplayedMap',
    visibleAction: 'pageHasNetwork'
});

async function init() {
    await client.loadBlockClasses(['NetworkDeviceBlock']);
}

async function configureClientPackageSettings() {
    // TODO: Add back when deploying. Package settings config did not save locally.
    // await configureSetting('apiKey');
    // await configureSetting('serverUrl');
    const additionalSettings: Map<string, string> = new Map<string, string>();
    additionalSettings.set('apiKey', process.env.UVX_API_KEY!);
    additionalSettings.set('serverUrl', process.env.UVX_BASE_URL!);

    await client.setPackageSettings(additionalSettings);
}

async function _configureSetting(setting: string) {
    let settings = await client.getPackageSettings();
    if (!settings.get(setting)) {
        if (await client.canEditPackageSettings()) {
            await client.alert(
                `You have not configured the ${setting}. You will now be prompted to complete that configuration.`
            );
            await client.showPackageSettingsModal();
            settings = await client.getPackageSettings();
            if (!settings.get(setting)) {
                return;
            }
        } else {
            await client.alert(
                `Your account has not configured the ${setting}. Talk with your Lucid account administrator to complete configuration.`
            );
        }
    }
}

function createDocEditor() {
    const data = Data.getInstance(client);
    return new DocumentEditor(viewport, data);
}

void init();
