import { EditorClient, LineProxy, PageProxy, Viewport } from 'lucid-extension-sdk';
import { DataClient } from '@data/data-client';
import { DrawBlocks } from 'src/doc/draw/draw-blocks';
import { DrawLines } from 'src/doc/draw/draw-lines';
import { NetworkDeviceBlock } from '@blocks/network-device-block';
import { TopoMap } from 'model/uvx/topo-map';
import { BlockUtils } from '@blocks/block-utils';

export class DrawTopoMap {
    static async drawTopoMap(client: EditorClient, viewport: Viewport, page: PageProxy, topoMap: TopoMap) {
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

        const guidToBlockMap = DrawBlocks.drawBlocks(
            viewport,
            page,
            topoMap.deviceNodes,
            customBlockDef,
            deviceCollectionId
        );
        DrawLines.drawLines(page, topoMap.deviceLinks, guidToBlockMap, linksCollectionId, topoMap.drawSettings);
    }

    // Takes in a list of devices to remove
    // Removes all device links and blocks
    // Returns the device guids for blocks that should be redrawn
    static clearMap(page: PageProxy, removeDevices?: string[]): string[] {
        DrawLines.clearLines(page);
        return DrawBlocks.clearBlocks(page, removeDevices);
    }

    // Takes in a list of device guids to be removed
    // Removes those device blocks and any connected lines.
    static removeBlocksAndLines(page: PageProxy, removeDevices: string[]) {
        const blocks = page.allBlocks;

        if (blocks) {
            for (const [, block] of blocks) {
                if (BlockUtils.isNetworkDeviceBlock(block)) {
                    const guid = BlockUtils.getGuidFromBlock(block);
                    if (!guid) continue;
                    if (removeDevices && removeDevices.includes(guid)) {
                        const lines: LineProxy[] = block.getConnectedLines();
                        for (const line of lines) {
                            line.delete();
                        }

                        block.delete();
                    }
                }
            }
        }
    }
}