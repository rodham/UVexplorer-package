import { EditorClient, Menu, Modal, Viewport } from 'lucid-extension-sdk';
import { UVexplorerModal } from './uvexplorer-modal';

class FirstModal extends Modal {
    constructor(client: EditorClient) {
        super(client, {
            title: 'First',
            width: 800,
            height: 600,
            url: 'http://localhost:4200/first'
        });
    }
}

class SecondModal extends Modal {
    constructor(client: EditorClient) {
        super(client, {
            title: 'Second',
            width: 800,
            height: 600,
            url: 'http://localhost:4200/second'
        });
    }
}

const client = new EditorClient();
const menu = new Menu(client);
const viewport: Viewport = new Viewport(client);

client.registerAction('loadNetwork', async () => {
    const modal = new UVexplorerModal(client, viewport);

    // Configuring settings using the showPackageSettingsModal() did not work locally
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

client.registerAction('first', async () => {
    const modal = new FirstModal(client);
    await modal.show();
});

menu.addDropdownMenuItem({
    label: 'First',
    action: 'first'
});

client.registerAction('second', async () => {
    const modal = new SecondModal(client);
    await modal.show();
});

menu.addDropdownMenuItem({
    label: 'Second',
    action: 'second'
});

async function init() {
    await client.loadBlockClasses(['LucidCardBlock']);
}

void init();
