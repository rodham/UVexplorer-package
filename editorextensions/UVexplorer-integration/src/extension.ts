import { CustomBlockProxy, EditorClient, JsonSerializable, Menu, Modal, Viewport } from 'lucid-extension-sdk';
import { isOpenSessionMessage } from '../model/iframe-message';
import { UVExplorerClient } from './uvexplorer-client';

async function init() {
    await client.loadBlockClasses(['FirstBlock']);
}

void init();

const client = new EditorClient();
const menu = new Menu(client);
const viewport = new Viewport(client);

const library = "UVexplorer-shapes";
const shape = 'first';

class FirstBlock extends CustomBlockProxy {
    private static library = "UVexplorer-shapes";
    private static shape = 'first';
    private static data: String;

    constructor(id: string, client: EditorClient, data: String) {
        super(id, client);
        FirstBlock.data = data;
    }

    public async createCustomBlock() {
        var customBlockDef = await client.getCustomShapeDefinition(library, shape);
    
        if (!customBlockDef) {
            return;
        }
    
        const page = viewport.getCurrentPage();
        if (page != undefined) {
            const customBlock = page.addBlock(customBlockDef);
            customBlock.shapeData.set("make", "Microsoft");  // This is how I can change the logo dynamically
            customBlock.shapeData.set("deviceType", "Phone");
            console.log("Created shape: " + FirstBlock.data);
        }
    }
}

class UVexplorerModal extends Modal {
    private uvexplorerClient: UVExplorerClient;
    constructor(client: EditorClient) {
        super(client, {
            title: 'UVexplorer',
            width: 800,
            height: 600,
            url: 'http://localhost:4200/login'
        });

        this.uvexplorerClient = new UVExplorerClient(client);
    }

    public async checkSettings() {
        const settings = await this.client.getPackageSettings();
        const apiKey = settings.get('apiKey');
        const serverUrl = settings.get('serverUrl');

        if (apiKey !== undefined && serverUrl !== undefined) {
            console.log('sending key to iframe', settings.get('apiKey'));
            await this.sendMessage({
                action: 'openSession',
                apiKey: apiKey,
                serverUrl: serverUrl
            });
        }
    }

    protected async messageFromFrame(message: JsonSerializable) {
        if (isOpenSessionMessage(message)) {
            const apiKey: string = message.apiKey;
            const serverUrl: string = message.serverUrl;

            const sessionGuid: string = await this.uvexplorerClient.openSession(serverUrl, apiKey);
            console.log(sessionGuid);

            await this.openSession(apiKey, serverUrl);

            const newBlock = new FirstBlock("0", client, message.serverUrl);
            newBlock.createCustomBlock();
        }
    }

    private async openSession(apiKey: string, serverUrl: string) {
        const additionalSettings: Map<string, string> = new Map<string, string>();

        additionalSettings.set('apiKey', apiKey);
        additionalSettings.set('serverUrl', serverUrl);

        await client.setPackageSettings(additionalSettings);
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

client.registerAction('login', () => {
    const modal = new UVexplorerModal(client);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    modal.checkSettings();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    modal.show();
});

menu.addDropdownMenuItem({
    label: 'Login',
    action: 'login'
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
