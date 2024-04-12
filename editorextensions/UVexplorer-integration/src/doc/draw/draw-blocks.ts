import { BlockDefinition, BlockProxy, MapProxy, PageProxy, Viewport } from 'lucid-extension-sdk';
import { DeviceNode } from 'model/uvx/device';
import { DEVICE_REFERENCE_KEY } from '@data/data-client';
import { getVendor } from 'model/uvx/vendor';
import { DEVICE_TYPE_NAME_MAP, getDeviceType } from 'model/uvx/device-type';
import { BlockUtils } from '@blocks/block-utils';
import { HUB_NODE, HubNode, HubNodeUtil } from 'model/uvx/hub-node';
import { ImageSettings } from 'model/uvx/topo-map';

export class DrawBlocks {
    /**
     * Places all DeviceNodes and HubNodes on the map with the specified image settings
     * Adds references for DeviceNodes to Device entries in the devices data collection for the current network
     */
    static drawBlocks(
        viewport: Viewport,
        page: PageProxy,
        deviceNodes: DeviceNode[],
        hubNodes: HubNode[],
        customBlockDef: BlockDefinition,
        collectionId: string,
        imageSettings: ImageSettings
    ) {
        const addedBlocks = [];
        const nodeIdToBlockMap = new Map<number, BlockProxy>();

        for (const deviceNode of deviceNodes) {
            const block = this.drawDeviceNode(page, deviceNode, customBlockDef, collectionId, imageSettings);
            addedBlocks.push(block);
            nodeIdToBlockMap.set(deviceNode.nodeId, block);
        }

        for (const hubNode of hubNodes) {
            const block = this.drawHubNode(page, hubNode, customBlockDef);
            addedBlocks.push(block);
            nodeIdToBlockMap.set(hubNode.nodeId, block);
        }

        viewport.focusCameraOnItems(addedBlocks);
        return nodeIdToBlockMap;
    }

    /**
     * Places a DeviceNode on the map
     */
    static drawDeviceNode(
        page: PageProxy,
        deviceNode: DeviceNode,
        customBlockDef: BlockDefinition,
        collectionId: string,
        imageSettings: ImageSettings
    ): BlockProxy {
        const block = page.addBlock({
            ...customBlockDef,
            boundingBox: { x: deviceNode.x, y: deviceNode.y, w: 50, h: 50 }
        });

        this.setShapeData(block, deviceNode, imageSettings);
        this.setReferenceKey(block, deviceNode, collectionId);

        return block;
    }

    /**
     * FOR SYNC
     * Updates the blocks
     */
    static updateBlocks(
        deviceNodes: DeviceNode[],
        collectionId: string,
        items: MapProxy<string, BlockProxy>,
        imageSettings: ImageSettings
    ) {
        console.log('Updating blocks data');
        for (const [, item] of items) {
            const guid = item.shapeData.get('Guid');
            if (!guid) continue;
            const deviceNode = deviceNodes.find((node) => node.deviceGuid === guid);
            if (!deviceNode) continue;
            this.updateBlock(item, deviceNode, collectionId, imageSettings);
        }
    }

    /**
     * FOR SYNC
     * Updates an existing device block with new shape data and a new reference key
     */
    static updateBlock(item: BlockProxy, deviceNode: DeviceNode, collectionId: string, imageSettings: ImageSettings) {
        this.setShapeData(item, deviceNode, imageSettings);
        this.setReferenceKey(item, deviceNode, collectionId);
    }

    /**
     * Places a single HubNode on the map
     */
    static drawHubNode(page: PageProxy, hubNode: HubNode, customBlockDef: BlockDefinition): BlockProxy {
        const block = page.addBlock({
            ...customBlockDef,
            boundingBox: { x: hubNode.x, y: hubNode.y, w: 50, h: 50 }
        });

        const deviceType = DEVICE_TYPE_NAME_MAP.get(HubNodeUtil.getCategoryImageKey(hubNode));
        block.shapeData.set('Guid', HUB_NODE);
        block.shapeData.set('DeviceType', deviceType);
        return block;
    }

    /**
     * Sets the shape data on a single block
     */
    static setShapeData(block: BlockProxy, deviceNode: DeviceNode, imageSettings: ImageSettings) {
        block.shapeData.set('Make', imageSettings.showVendor ? getVendor(deviceNode) : '');
        block.shapeData.set('DeviceType', getDeviceType(deviceNode));
        block.shapeData.set('Guid', deviceNode.deviceGuid);
        block.shapeData.set('Status', imageSettings.showStatus ? deviceNode.status : '');
        block.shapeData.set('DisplayName', imageSettings.showDisplayName ? deviceNode.displayName : '');
    }

    /**
     * Sets the reference key on a single block
     */
    static setReferenceKey(block: BlockProxy, deviceNode: DeviceNode, collectionId: string) {
        block.setReferenceKey(DEVICE_REFERENCE_KEY, {
            collectionId: collectionId,
            primaryKey: `"${deviceNode.deviceGuid}"`,
            readonly: true
        });
    }

    /**
     * FOR AUTO-LAYOUT
     * Removes specified devices from the map
     * Returns a list of device guids that remain on the map
     * @param page
     * @param removeDevices A list of device guids that should be removed from the map
     */
    static clearBlocks(page: PageProxy, removeDevices?: string[]) {
        const pageItems = page.allBlocks;
        const remainDevices = [];

        if (pageItems) {
            for (const [, item] of pageItems) {
                if (BlockUtils.isNetworkDeviceBlock(item)) {
                    const guid = BlockUtils.getGuidFromBlock(item);
                    item.delete();
                    if (!guid) continue;
                    if (!(removeDevices && removeDevices.includes(guid))) {
                        // Device should remain
                        remainDevices.push(guid);
                    }
                }
            }
        }

        return remainDevices;
    }
}
