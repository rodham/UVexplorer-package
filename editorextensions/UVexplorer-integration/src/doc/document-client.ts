import { EditorClient, LineProxy, Viewport } from 'lucid-extension-sdk';
import { TopoMap } from 'model/uvx/topo-map';
import { BlockUtils } from '@blocks/block-utils';
import { DataClient } from '@data/data-client';
import { DrawTopoMap } from 'src/doc/draw/draw-topo-map';

export class DocumentClient {
    protected viewport: Viewport;
    protected dataClient: DataClient;

    constructor(viewport: Viewport, data: DataClient) {
        this.viewport = viewport;
        this.dataClient = data;
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
        const networkGuid = this.dataClient.getNetworkForPage(pageId);
        return networkGuid;
    }

    getNetworkSource(name: string, guid: string) {
        const source = this.dataClient.createOrRetrieveNetworkSource(name, guid);
        const page = this.viewport.getCurrentPage();
        if (page) {
            this.dataClient.updatePageMap(page.id, guid);
        }
        console.log(`Successfully loaded network: ${name}`);
        return source;
    }

    async drawMap(topoMap: TopoMap, client: EditorClient): Promise<void> {
        const page = this.viewport.getCurrentPage();
        if (!page) {
            console.error('Unable to get page');
            return;
        }
        this.dataClient.saveLinks(this.dataClient.getNetworkForPage(page.id), topoMap.deviceLinks);
        await DrawTopoMap.drawTopoMap(client, this.viewport, page, topoMap);
    }

    clearMap(devices: string[], removeDevices?: string[]): string[] {
        const page = this.viewport.getCurrentPage();
        if (!page) {
            console.error('Unable to get page');
            return [];
        }
        return DrawTopoMap.clearMap(page, devices, removeDevices);
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

    // Given a list of deviceGuids, removes all device blocks and any connected lines.
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
