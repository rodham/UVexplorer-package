import { BlockProxy, EditorClient, LineProxy, MapProxy, PageProxy, Viewport } from 'lucid-extension-sdk';
import { DataClient } from '@data/data-client';
import { DrawBlocks } from 'src/doc/draw/draw-blocks';
import { DrawLines } from 'src/doc/draw/draw-lines';
import { NetworkDeviceBlock } from '@blocks/network-device-block';
import { ImageSettings, TopoMap } from 'model/uvx/topo-map';
import { BlockUtils } from '@blocks/block-utils';

export class DrawTopoMap {
    /**
     * Render a TopoMap on the current page
     * @param client
     * @param viewport
     * @param page
     * @param topoMap
     * @param imageSettings
     */
    static async drawTopoMap(
        client: EditorClient,
        viewport: Viewport,
        page: PageProxy,
        topoMap: TopoMap,
        imageSettings: ImageSettings
    ) {
        // Load in custom blocks
        const customBlockDef = await client.getCustomShapeDefinition(
            NetworkDeviceBlock.library,
            NetworkDeviceBlock.shape
        );
        if (!customBlockDef) {
            return;
        }

        const data = DataClient.getInstance(client);
        const deviceCollectionId = data.getDeviceCollectionForPage(page.id);
        const displayEdgeCollectionId = data.getDisplayEdgeCollectionForPage(page.id);

        const nodeIdToBlockMap = DrawBlocks.drawBlocks(
            viewport,
            page,
            topoMap.deviceNodes,
            topoMap.hubNodes,
            customBlockDef,
            deviceCollectionId,
            imageSettings
        );

        if (topoMap.displayEdges) {
            DrawLines.drawLines(
                page,
                topoMap.displayEdges,
                nodeIdToBlockMap,
                displayEdgeCollectionId,
                topoMap.drawSettings,
                topoMap.layoutSettings.showLinkLabels
            );
        }
    }

    /**
     * FOR SYNC
     * Updates the information for all devices rendered on the current page
     * @param data
     * @param pageId
     * @param topoMap
     * @param items
     * @param imageSettings
     */
    static refreshPageItems(
        data: DataClient,
        pageId: string,
        topoMap: TopoMap,
        items: MapProxy<string, BlockProxy>,
        imageSettings: ImageSettings
    ) {
        const deviceCollectionId = data.getDeviceCollectionForPage(pageId);
        DrawBlocks.updateBlocks(topoMap.deviceNodes, deviceCollectionId, items, imageSettings);
    }

    /**
     * FOR AUTO-LAYOUT
     * Removes specified devices from the map and all connected lines
     * Returns a list of device guids that remain on the map
     * @param page
     * @param removeDevices A list of device guids that should be removed from the map
     */
    static clearMap(page: PageProxy, removeDevices?: string[]): string[] {
        DrawLines.clearLines(page);
        return DrawBlocks.clearBlocks(page, removeDevices);
    }

    /**
     * FOR MANUAL-LAYOUT
     * Removes specified devices and all of their connected lines from the map
     * @param page
     * @param removeDevices A list of device guids that should be removed from the map
     */
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

        this.removeUnconnectedBlocksWithoutGuids(page);
    }

    /**
     * FOR MANUAL-LAYOUT
     * Removes hub nodes (blocks without guids) and any connected lines when the hub node is no longer connected to anything
     * @param page
     * @private
     */
    private static removeUnconnectedBlocksWithoutGuids(page: PageProxy) {
        const blocks = page.allBlocks;

        if (blocks) {
            for (const [, block] of blocks) {
                if (BlockUtils.isNetworkDeviceBlock(block)) {
                    const guid = BlockUtils.getGuidFromBlock(block);
                    if (!guid) {
                        const lines: LineProxy[] = block.getConnectedLines();
                        if (lines.length == 0) {
                            block.delete();
                        }
                    }
                }
            }
        }
    }
}
