import { EditorClient, Viewport } from 'lucid-extension-sdk';
import { DrawSettings, ImageSettings, LayoutSettings, TopoMap } from 'model/uvx/topo-map';
import { BlockUtils } from '@blocks/block-utils';
import { DataClient } from '@data/data-client';
import { DrawTopoMap } from 'src/doc/draw/draw-topo-map';

/**
 * Contains functions called to interact with the document's content
 */
export class DocumentClient {
    protected viewport: Viewport;
    protected dataClient: DataClient;

    constructor(viewport: Viewport, data: DataClient) {
        this.viewport = viewport;
        this.dataClient = data;
    }

    /**
     * Returns the pageId for current page
     */
    getPageId() {
        return this.viewport.getCurrentPage()?.id;
    }

    /**
     * Returns the network guid for the network loaded on the current page
     */
    getPageNetworkGuid() {
        const pageId = this.getPageId();
        if (!pageId) {
            console.error('No page id found');
            return;
        }
        return this.dataClient.getNetworkForPage(pageId);
    }

    /**
     * Saves the user's draw, layout, and image settings changes for the current page in the datastore.
     * Overwrites the existing settings.
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

    /**
     * Retrieves the current page's layout settings from the datastore
     */
    getLayoutSettings() {
        const pageId = this.getPageId();
        if (pageId === undefined) {
            throw Error('Unable to retrieve layout settings, no page id found');
        }
        const collection = this.dataClient.createOrRetrieveSettingsCollection();
        return this.dataClient.getLayoutSettings(collection, pageId);
    }

    /**
     * Returns the current page's device filter from the datastore (for dynamic selection)
     */
    getDeviceFilter() {
        const pageId = this.getPageId();
        if (pageId === undefined) {
            throw Error('Unable to retrieve device filter, no page id found');
        }
        const collection = this.dataClient.createOrRetrieveDeviceFilterCollection();
        return this.dataClient.getDeviceFilter(collection, pageId);
    }

    /**
     * Returns the network source for the current page
     * The network source contains the data collections for devices and display edges (links)
     * Will create a new network source if it does not exist
     * @param guid The network guid
     * @param name The name of the network (optional).
     */
    getNetworkSource(guid: string, name?: string) {
        const source = this.dataClient.createOrRetrieveNetworkSource(guid, name);
        const page = this.viewport.getCurrentPage();
        if (page) {
            this.dataClient.updatePageMap(page.id, guid);
        }
        console.log(`Successfully loaded network: ${name}`);
        return source;
    }

    /**
     * Returns the list of device guids for devices rendered on the current page
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

    /**
     * FOR SYNC
     * Updates the information and image settings for all devices rendered on the current page.
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

    /**
     * Render a new TopoMap on the current page
     */
    async drawMap(topoMap: TopoMap, client: EditorClient, imageSettings: ImageSettings, data: DataClient): Promise<void> {
        const page = this.viewport.getCurrentPage();
        if (!page) {
            console.error('Unable to get page');
            return;
        }
        await DrawTopoMap.drawTopoMap(client, this.viewport, page, topoMap, imageSettings, data);
    }

    /**
     * FOR AUTO-LAYOUT
     * Removes specified devices from the map
     * Returns a list of the device guids that remain on the map
     * The entire map is cleared.
     */
    clearMap(removeDevices?: string[]): string[] {
        const page = this.viewport.getCurrentPage();
        if (!page) {
            console.error('Unable to get page');
            return [];
        }
        return DrawTopoMap.clearMap(page, removeDevices);
    }

    /**
     * FOR MANUAL-LAYOUT
     * Removes specified devices and all of their connected lines from the map.
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
