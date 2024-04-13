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
import { pageHasNetwork, syncDisplayedMap } from '@actions/network';
import { SettingsModal } from '@uvx/settings-modal';
import { DataClient } from '@data/data-client';
import { DocumentClient } from '@doc/document-client';
import { UVExplorerClient } from '@uvx/uvx-client';
import { configureClientPackageSettings } from 'src/package-settings';

const client = new EditorClient();
const viewport: Viewport = new Viewport(client);
const menu = new Menu(client);
const uvxClient = new UVExplorerClient(client);
const dataClient = new DataClient(client);
const docClient = new DocumentClient(viewport, dataClient);

// Register conditional visibility actions within the Lucid client
client.registerAction('uvDeviceSelected', () => {
    return uvDeviceSelected(viewport);
});

client.registerAction('singleDeviceSelected', () => {
    return singleDeviceSelected(viewport);
});

client.registerAction('deviceLinkSelected', () => {
    return deviceLinkSelected(viewport);
});

client.registerAction('pageHasNetwork', () => {
    return pageHasNetwork(docClient);
});

// Register on-click actions within the Lucid client
client.registerAction('showConnectedDevices', async () => {
    await configureClientPackageSettings(client);
    const selection = viewport.getSelectedItems();
    await showConnectedDevices(selection, client, docClient, uvxClient, dataClient);
});

client.registerAction('viewDeviceDetails', async () => {
    await configureClientPackageSettings(client);
    const selection = viewport.getSelectedItems();
    await viewDeviceDetails(selection, client, docClient, uvxClient, dataClient);
});

client.registerAction('viewLinkDetails', async () => {
    const selection = viewport.getSelectedItems();
    await viewLinkDetails(selection, client, docClient, uvxClient, dataClient);
});

client.registerAction('syncDisplayedMap', async () => {
    await configureClientPackageSettings(client);
    await syncDisplayedMap(client, docClient, uvxClient, dataClient);
});

client.registerAction('loadMapSettings', async () => {
    const modal = new SettingsModal(client, docClient, uvxClient, dataClient);
    await modal.show();
    await modal.sendMapSettings(false);
});

client.registerAction('loadNetwork', async () => {
    const modal = new DevicesModal(client, docClient, uvxClient, dataClient);

    await configureClientPackageSettings(client);

    await modal.show();
    await modal.sendNetworks(false);
});

//Add context menu items for registered actions (right-click a network device)
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

//Add dropdown menu items for registered actions ('Extensions' in top bar)
menu.addDropdownMenuItem({
    label: 'Device Selection',
    action: 'loadNetwork'
});

menu.addDropdownMenuItem({
    label: 'Map Settings',
    action: 'loadMapSettings'
});

menu.addDropdownMenuItem({
    label: 'Sync Page with UVExplorer',
    action: 'syncDisplayedMap',
    visibleAction: 'pageHasNetwork'
});

/**
 * Runs at startup
 */
async function init() {
    // Declare & load any custom shapes that are used in the extension
    // network-device-block.ts
    await client.loadBlockClasses(['NetworkDeviceBlock']);
}

void init();
