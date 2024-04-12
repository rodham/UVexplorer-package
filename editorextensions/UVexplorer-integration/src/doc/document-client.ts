import { EditorClient, Viewport } from 'lucid-extension-sdk';
import { DrawSettings, ImageSettings, LayoutSettings, TopoMap } from 'model/uvx/topo-map';
import { BlockUtils } from '@blocks/block-utils';
import { DataClient } from '@data/data-client';
import { DrawTopoMap } from 'src/doc/draw/draw-topo-map';

export class DocumentClient {
    protected viewport: Viewport;
    protected dataClient: DataClient;

    /*
    * Initialize the viewport and dataclient to given values
    */
    constructor(viewport: Viewport, data: DataClient) {
        this.viewport = viewport;
        this.dataClient = data;
    }

    /*
    * Returns the pageId for current page
    */
    getPageId() {
        return this.viewport.getCurrentPage()?.id;
    }

    /*
    * Returns the network guid associated with current page
    */
    getPageNetworkGuid() {
        const pageId = this.getPageId();
        if (!pageId) {
            console.error('No page id found');
            return;
        }
        return this.dataClient.getNetworkForPage(pageId);
    }

    /*
    * Saves given drawSettings, layoutSettings, and imageSettings to the settings collection and deletes previously
    * existing settings
    */
    saveSettings(drawSettings: DrawSettings, layoutSettings: LayoutSettings, imageSettings: ImageSettings) {
        const pageId = this.getPageId();
        if (pageId === undefined) {
            throw Error('Unable to save settings, no page id found');
        }
        const collection = this.dataClient.createOrRetrieveSettingsCollection();
        this.dataClient.deleteSettingsFromCollection(collection, pageId);
        this.dataClient.addSettingsToCollection(collection, pageId, layoutSettings, drawSettings, imageSettings);
    }

    /*
    * retieves the layout settings for the current page
    */
    getLayoutSettings() {
        const pageId = this.getPageId();
        if (pageId === undefined) {
            throw Error('Unable to retrieve layout settings, no page id found');
        }
        const collection = this.dataClient.createOrRetrieveSettingsCollection();
        return this.dataClient.getLayoutSettings(collection, pageId);
    }

    /*
    * Returns the device filter for the current page
    */
    getDeviceFilter() {
        const pageId = this.getPageId();
        if (pageId === undefined) {
            throw Error('Unable to retrieve device filter, no page id found');
        }
        const collection = this.dataClient.createOrRetrieveDeviceFilterCollection();
        return this.dataClient.getDeviceFilter(collection, pageId);
    }

    /*
    * Returns the Data source for the network of the current page
    */
    getNetworkSource(name: string, guid: string) {
        const source = this.dataClient.createOrRetrieveNetworkSource(name, guid);
        const page = this.viewport.getCurrentPage();
        if (page) {
            this.dataClient.updatePageMap(page.id, guid);
        }
        console.log(`Successfully loaded network: ${name}`);
        return source;
    }

    /*
    * Retrieves the guids for all the network device blocks on the current page
    */
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

    /*
    * Updates the info for the devices on the current page.
    */
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
    }

    /*
    * Draws the topoMap on the current page with the configured imageSettings
    */
    async drawMap(topoMap: TopoMap, client: EditorClient, imageSettings: ImageSettings): Promise<void> {
        const page = this.viewport.getCurrentPage();
        if (!page) {
            console.error('Unable to get page');
            return;
        }
        await DrawTopoMap.drawTopoMap(client, this.viewport, page, topoMap, imageSettings);
    }

    /*
    * Removes the devices on current page and returns list of those device guids
    */
    clearMap(removeDevices?: string[]): string[] {
        const page = this.viewport.getCurrentPage();
        if (!page) {
            console.error('Unable to get page');
            return [];
        }
        return DrawTopoMap.clearMap(page, removeDevices);
    }

    /*
    * Removes given devices and all lines connected to those devices from the map
    */
    removeFromMap(devices: string[]) {
        const page = this.viewport.getCurrentPage();
        if (!page) {
            console.error('Unable to get page');
            return;
        }
        DrawTopoMap.removeBlocksAndLines(page, devices);
    }
}
