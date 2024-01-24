import { EditorClient, Menu, MenuType, Modal } from 'lucid-extension-sdk';

class HelloWorldModal extends Modal {
    constructor(client: EditorClient) {
        super(client, {
            title: 'Hello world',
            width: 800,
            height: 600,
            url: 'http://localhost:4200'
        });
    }
}

const client = new EditorClient();
const menu = new Menu(client);

client.registerAction('hello', () => {
    const modal = new HelloWorldModal(client);
    modal.show();
});

menu.addDropdownMenuItem({
    label: 'Say Hello',
    action: 'hello',
});
