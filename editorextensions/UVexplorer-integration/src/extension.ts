import {EditorClient, JsonSerializable, Menu, Modal} from 'lucid-extension-sdk';
import {isOpenSessionMessage} from "../model/iframe-message";

class HelloWorldModal extends Modal {
    constructor(client: EditorClient) {
        super(client, {
            title: 'Hello world',
            width: 800,
            height: 600,
            url: 'http://localhost:4200'
        });
    }

    public async checkSettings() {
        const settings = await this.client.getPackageSettings();
        const apiKey = settings.get('apiKey');
        const serverUrl = settings.get('serverUrl');


        if (apiKey !== undefined && serverUrl !== undefined) {
            console.log('sending key to iframe', settings.get('apiKey'))
            await this.sendMessage({
                'action': 'openSession',
                'apiKey': apiKey,
                'serverUrl': serverUrl
            });
        }
    }

    protected async messageFromFrame(message: JsonSerializable) {
        if (isOpenSessionMessage(message)) {
            const apiKey: string = message.apiKey;
            const serverUrl: string = message.serverUrl;
            await this.openSession(apiKey, serverUrl);
        }
    }

    private async openSession(apiKey: string, serverUrl: string) {
        const additionalSettings: Map<string, string> = new Map<string, string>();

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
    modal.checkSettings();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    modal.show();
});

menu.addDropdownMenuItem({
    label: 'Say Hello',
    action: 'hello'
});

