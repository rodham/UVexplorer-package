import { EditorClient, PageProxy, Viewport } from 'lucid-extension-sdk';
import { DeviceNode, DeviceLink } from 'model/uvx/device';
import { Data } from '@data/data';
import { Block } from '@draw/block';
import { Line } from '@draw/line';
import {NetworkDeviceBlock} from "@blocks/network-device-block";

export class Draw {
    static async drawTopoMap(
        client: EditorClient,
        viewport: Viewport,
        page: PageProxy,
        deviceNodes: DeviceNode[],
        deviceLinks: DeviceLink[]
    ) {
        const customBlockDef = await client.getCustomShapeDefinition(NetworkDeviceBlock.library, NetworkDeviceBlock.shape);
        if (!customBlockDef) {
            return;
        }

        const data = Data.getInstance(client);
        const deviceCollectionId = data.getDeviceCollectionForPage(page.id);
        const linksCollectionId = data.getLinksCollectionForPage(page.id);

        const guidToBlockMap = Block.drawBlocks(viewport, page, deviceNodes, customBlockDef, deviceCollectionId);
        Line.drawLines(deviceLinks, guidToBlockMap, linksCollectionId);
    }

}


