import { CustomBlockProxy, EditorClient, Viewport } from "lucid-extension-sdk";

export class NetworkDeviceBlockModel extends CustomBlockProxy {
    private library = "UVexplorer-shapes";
    private shape = 'networkDevice';

    private company: string;
    private deviceType: string;
    private viewport: Viewport;

    constructor(id: string, client: EditorClient, company: string, deviceType: string) {
        super(id, client);
        this.company = company;
        this.deviceType = deviceType;
        this.viewport = new Viewport(client);
    }

    public async drawBlock() {
        var customBlockDef = await this.client.getCustomShapeDefinition(this.library, this.shape);
    
        if (!customBlockDef) {
            return;
        }
    
        const page = this.viewport.getCurrentPage();
        if (page != undefined) {
            const customBlock = page.addBlock(customBlockDef);
            customBlock.shapeData.set("make", this.company);
            customBlock.shapeData.set("deviceType", this.deviceType);
        }
    }
}