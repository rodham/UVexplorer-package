import { BlockDefinition, BlockProxy, PageProxy, Viewport } from 'lucid-extension-sdk';
import { DeviceNode } from 'model/uvx/device';
import { DEVICE_REFERENCE_KEY } from '@data/data';
import {getVendor} from "model/uvx/vendor";
import {getDeviceType} from "model/uvx/device-type";

export class DrawBlocks {
    static drawBlocks(
        viewport: Viewport,
        page: PageProxy,
        deviceNodes: DeviceNode[],
        customBlockDef: BlockDefinition,
        collectionId: string
    ) {
        const addedBlocks = [];
        const guidToBlockMap = new Map<string, BlockProxy>();

        for (const deviceNode of deviceNodes) {
            const block = this.drawBlock(page, deviceNode, customBlockDef, collectionId);
            addedBlocks.push(block);
            guidToBlockMap.set(deviceNode.deviceGuid, block);
        }

        viewport.focusCameraOnItems(addedBlocks);
        return guidToBlockMap;
    }

    static drawBlock(
        page: PageProxy,
        deviceNode: DeviceNode,
        customBlockDef: BlockDefinition,
        collectionId: string
    ): BlockProxy {
        const block = page.addBlock({
            ...customBlockDef,
            boundingBox: { x: deviceNode.x, y: deviceNode.y, w: 50, h: 50 }
        });

        this.setShapeData(block, deviceNode);
        this.setReferenceKey(block, deviceNode, collectionId);

        return block;
    }

    static setShapeData(block: BlockProxy, deviceNode: DeviceNode) {
        block.shapeData.set('Make', getVendor(deviceNode));
        block.shapeData.set('DeviceType', getDeviceType(deviceNode));
        block.shapeData.set('Guid', deviceNode.deviceGuid);
    }

    static setReferenceKey(block: BlockProxy, deviceNode: DeviceNode, collectionId: string) {
        block.setReferenceKey(DEVICE_REFERENCE_KEY, {
            collectionId: collectionId,
            primaryKey: `"${deviceNode.deviceGuid}"`,
            readonly: true
        });
    }
}


