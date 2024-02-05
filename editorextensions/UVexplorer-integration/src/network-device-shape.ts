import { CustomBlockProxy, EditorClient, Viewport } from 'lucid-extension-sdk';

export class NetworkDeviceBlock extends CustomBlockProxy {
    private viewport: Viewport;
    private library = "UVexplorer-shapes";
    private shape = 'networkDevice';

    constructor(id: string, client: EditorClient) {
        super(id, client);
        this.viewport = new Viewport(client);
    }

    public async createCustomBlock() {
        var customBlockDef = await this.client.getCustomShapeDefinition(this.library, this.shape);
    
        if (!customBlockDef) {
            return;
        }
    
        const page = this.viewport.getCurrentPage();
        if (page != undefined) {
            const customBlock = page.addBlock(customBlockDef);
            customBlock.shapeData.set("make", "Microsoft");  // This is how I can change the logo dynamically
            customBlock.shapeData.set("deviceType", "Phone");
            console.log("Created New Block");
        }
    }
}