import { EditorClient, Viewport } from 'lucid-extension-sdk';
import { DrawSettings, ImageSettings, LayoutSettings, TopoMap } from 'model/uvx/topo-map';
import { BlockUtils } from '@blocks/block-utils';
import { DataClient } from '@data/data-client';
import { DrawTopoMap } from 'src/doc/draw/draw-topo-map';
import { DeviceFilter } from 'model/uvx/device';

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
        return this.dataClient.getNetworkForPage(pageId);
    }

    saveSettings(drawSettings: DrawSettings, layoutSettings: LayoutSettings, imageSettings: ImageSettings) {
        const pageId = this.getPageId();
        if (pageId === undefined) {
            throw Error('Unable to save settings, no page id found');
        }
        const collection = this.dataClient.createOrRetrieveSettingsCollection();
        this.dataClient.deleteSettingsFromCollection(collection, pageId);
        this.dataClient.addSettingsToCollection(collection, pageId, layoutSettings, drawSettings, imageSettings);
    }

    getLayoutSettings() {
        const pageId = this.getPageId();
        if (pageId === undefined) {
            throw Error('Unable to retrieve layout settings, no page id found');
        }
        const collection = this.dataClient.createOrRetrieveSettingsCollection();
        return this.dataClient.getLayoutSettings(collection, pageId);
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

    updateItemsInfo(topoMap: TopoMap, imageSettings: ImageSettings) {
        const pageItems = this.viewport.getCurrentPage()?.allBlocks;
        const pageId = this.getPageId();

        if (!pageItems) {
            console.log('No blocks on page');
            return;
        }
        if (!pageId) {
            console.error('Unable to get page');
            return;
        }

        DrawTopoMap.refreshPageItems(this.dataClient, pageId, topoMap, pageItems, imageSettings);
        this.dataClient.saveLinks(this.dataClient.getNetworkForPage(pageId), topoMap.deviceLinks);
    }

    async drawMap(topoMap: TopoMap, client: EditorClient, imageSettings: ImageSettings): Promise<void> {
        const page = this.viewport.getCurrentPage();
        if (!page) {
            console.error('Unable to get page');
            return;
        }
        this.dataClient.saveLinks(this.dataClient.getNetworkForPage(page.id), topoMap.deviceLinks);
        await DrawTopoMap.drawTopoMap(client, this.viewport, page, topoMap, imageSettings);
    }

    clearMap(removeDevices?: string[]): string[] {
        const page = this.viewport.getCurrentPage();
        if (!page) {
            console.error('Unable to get page');
            return [];
        }
        return DrawTopoMap.clearMap(page, removeDevices);
    }

    removeFromMap(devices: string[]) {
        const page = this.viewport.getCurrentPage();
        if (!page) {
            console.error('Unable to get page');
            return;
        }
        DrawTopoMap.removeBlocksAndLines(page, devices);
    }
}
