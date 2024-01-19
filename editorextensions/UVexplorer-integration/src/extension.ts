import {EditorClient, Menu, MenuType, Viewport} from 'lucid-extension-sdk';
import {ImportModal} from './importmodal';

const client = new EditorClient();
const menu = new Menu(client);
const viewport = new Viewport(client);

client.registerAction('test', () => {
    const modal = new ImportModal(client);
    modal.show();
});

menu.addMenuItem({
    label: 'Test thing 2',
    action: 'test',
    menuType: MenuType.Main,
});
