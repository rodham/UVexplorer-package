import { EditorClient, PageProxy, Viewport } from 'lucid-extension-sdk';
import { DataClient } from '@data/data-client';
import { DrawBlocks } from 'src/doc/draw/draw-blocks';
import { DrawLines } from 'src/doc/draw/draw-lines';
import { NetworkDeviceBlock } from '@blocks/network-device-block';
import { TopoMap } from 'model/uvx/topo-map';

export class DrawTopoMap {
    static async drawTopoMap(
        client: EditorClient,
        viewport: Viewport,
        page: PageProxy,
        topoMap: TopoMap
    ) {
        const customBlockDef = await client.getCustomShapeDefinition(
            NetworkDeviceBlock.library,
            NetworkDeviceBlock.shape
        );
        if (!customBlockDef) {
            return;
        }

        const data = DataClient.getInstance(client);
        const deviceCollectionId = data.getDeviceCollectionForPage(page.id);
        const linksCollectionId = data.getLinksCollectionForPage(page.id);

        const guidToBlockMap = DrawBlocks.drawBlocks(viewport, page, topoMap.deviceNodes, customBlockDef, deviceCollectionId);
        DrawLines.drawLines(page, topoMap.deviceLinks, guidToBlockMap, linksCollectionId, topoMap.drawSettings);
    }

    static clearMap(page: PageProxy, devices: string[], removeDevices?: string[]): string[] {
        DrawLines.clearLines(page);
        return DrawBlocks.removeBlocks(page, removeDevices);
    }
}
