import { EditorClient, Menu, Modal } from 'lucid-extension-sdk';

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

client.registerAction('hello', () => {
    const modal = new HelloWorldModal(client);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    modal.show();
});

menu.addDropdownMenuItem({
    label: 'Say Hello',
    action: 'hello'
});

client.registerAction('first', () => {
    const modal = new FirstModal(client);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    modal.show();
});

menu.addDropdownMenuItem({
    label: 'First',
    action: 'first'
});

client.registerAction('second', () => {
    const modal = new SecondModal(client);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    modal.show();
});

menu.addDropdownMenuItem({
    label: 'Second',
    action: 'second'
});
