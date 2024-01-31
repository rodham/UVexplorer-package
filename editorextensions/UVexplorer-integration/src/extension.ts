import {EditorClient, JsonSerializable, Menu, Modal} from 'lucid-extension-sdk';

class HelloWorldModal extends Modal {
    constructor(client: EditorClient) {
        super(client, {
            title: 'Hello world',
            width: 800,
            height: 600,
            url: 'http://localhost:4200'
        });

        this.checkSettings()
    }

    protected async checkSettings() {
        const settings = await this.client.getPackageSettings();
        const apiKey = settings.get('apiKey');
        const serverUrl = settings.get('serverUrl');


        if (apiKey !== undefined && serverUrl !== undefined) {
            console.log('sending key to iframe', settings.get('apiKey'))
            this.sendMessage({
               'apiKey': apiKey,
               'serverUrl': serverUrl
            });
        }
    }

    protected messageFromFrame(message: JsonSerializable) {
        if (message['apiKey'] !== undefined && message != null && message['serverUrl'] !== undefined) {
            this.changePackageSettings(message['apiKey'], message['serverUrl']);
        }
    }

    private async changePackageSettings(apiKey: string, serverUrl: string) {
        console.log(apiKey, serverUrl)

        const additionalSettings: Map<string, string> = new Map();

        additionalSettings.set('apiKey', apiKey);
        additionalSettings.set('serverUrl', serverUrl);

        await client.setPackageSettings(additionalSettings);
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

