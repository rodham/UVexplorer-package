import { EditorClient, LineProxy, PageProxy, Viewport } from 'lucid-extension-sdk';
import { DeviceLink } from 'model/uvx/device';
import { TopoMap } from 'model/uvx/topo-map';
import { BlockUtils } from '@blocks/block-utils';
import { Data } from '@data/data';
import { DrawTopoMap } from '@draw/draw-topo-map';

export class DocumentEditor {
    protected viewport: Viewport;
    protected data: Data;

    constructor(viewport: Viewport, data: Data) {
        this.viewport = viewport;
        this.data = data;
    }

    getPageId() {
        return this.viewport.getCurrentPage()?.id;
    }

    getPageNetworkGuid() {
        const pageId = this.getPageId();
        if (!pageId) {
            console.error('No page id found');
            return;
        }
        const networkGuid = this.data.getNetworkForPage(pageId);
        return networkGuid;
    }

    getNetworkSource(name: string, guid: string) {
        const source = this.data.createOrRetrieveNetworkSource(name, guid);
        const page = this.viewport.getCurrentPage();
        if (page !== undefined) {
            this.data.updatePageMap(page.id, guid);
        }
        console.log(`Successfully loaded network: ${name}`);
        return source;
    }

    /**
     * TopoMap TopoMap
     * @param devices New device guids to be drawn on the map.
     * @param removeDevices Device guids to be removed from the map.
     */
    async drawMap(topoMap: TopoMap, client: EditorClient): Promise<void> {
        const page = this.viewport.getCurrentPage();
        if (!page) {
            console.error('Unable to get page');
            return;
        }
        this.saveLinks(this.data.getNetworkForPage(page.id), topoMap.deviceLinks);
        await DrawTopoMap.drawTopoMap(client, this.viewport, page, topoMap.deviceNodes, topoMap.deviceLinks);
    }

    clearMap(devices: string[], removeDevices?: string[]): string[] {
        const page = this.viewport.getCurrentPage();
        if (!page) {
            console.error('Unable to get page');
            return [];
        }
        this.clearLines(page);
        return this.clearBlocks(page, devices, removeDevices);
    }

    clearLines(page: PageProxy) {
        // TODO: only delete device connection lines not all lines
        const lines = page.allLines;
        if (lines) {
            for (const [, line] of lines) {
                line.delete();
            }
        }
    }

    /**
     * Clear Blocks
     * @param page The page to clear
     * @param devices New device guids to be drawn on the map.
     * @param removeDevices Device guids to be removed from the map.
     * @return List of device guids that already exist on the map and should not be removed
     *         in addition to new device guids to be drawn.
     */
    clearBlocks(page: PageProxy, devices: string[], removeDevices?: string[]) {
        const pageItems = page.allBlocks;

        if (pageItems) {
            for (const [, item] of pageItems) {
                if (BlockUtils.isNetworkDeviceBlock(item)) {
                    const guid = BlockUtils.getGuidFromBlock(item);
                    if (!guid) continue;
                    item.delete();
                    if (!devices.includes(guid) && !(removeDevices && removeDevices.includes(guid))) {
                        // Device should remain
                        devices.push(guid);
                    }
                }
            }
        }

        return devices;
    }

    getNetworkDeviceBlockGuids(): string[] {
        const pageItems = this.viewport.getCurrentPage()?.allBlocks;

        if (!pageItems) {
            console.log('No blocks on page');
            return [];
        }

        const guids = [];
        for (const [, item] of pageItems) {
            if (BlockUtils.isNetworkDeviceBlock(item)) {
                const guid = BlockUtils.getGuidFromBlock(item);
                if (!guid) continue;
                guids.push(guid);
            }
        }

        return guids;
    }

    saveLinks(networkGuid: string, links: DeviceLink[]) {
        const source = this.data.createOrRetrieveNetworkSource('', networkGuid);
        const collection = this.data.createOrRetrieveLinkCollection(source);
        this.data.clearCollection(collection); // TODO: Replace once updateLinksInCollection Function is implemented
        this.data.addLinksToCollection(collection, links);
    }

    removeBlocksAndLines(devices?: string[]) {
        if (!devices || devices.length == 0) return;

        const page = this.viewport.getCurrentPage();
        if (!page) {
            return;
        }

        const blocks = page.allBlocks;

        if (blocks) {
            for (const [, block] of blocks) {
                if (BlockUtils.isNetworkDeviceBlock(block)) {
                    const guid = BlockUtils.getGuidFromBlock(block);
                    if (!guid) continue;
                    if (devices && devices.includes(guid)) {
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

    getCurrentPageItems(): string[] {
        const pageItems = this.viewport.getCurrentPage()?.allItems;
        const devicesShown: string[] = [];
        if (pageItems) {
            for (const [, item] of pageItems) {
                if (BlockUtils.isNetworkDeviceBlock(item)) {
                    const guid = BlockUtils.getGuidFromBlock(item);
                    if (!guid) continue;
                    devicesShown.push(guid);
                }
            }
        }

        return devicesShown;
    }
}
