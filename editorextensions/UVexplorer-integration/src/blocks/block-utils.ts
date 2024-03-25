import { BlockProxy, CustomBlockProxy, ItemProxy, LineProxy, PageProxy } from 'lucid-extension-sdk';
import { Device } from 'model/uvx/device';
import { DEVICE_REFERENCE_KEY, DISPLAY_EDGE_REFERENCE_KEY } from '@data/data-client';
import { itemToDevice, itemToDisplayEdge, removeQuotationMarks } from '@data/data-utils';
import { NetworkDeviceBlock } from './network-device-block';
import { DisplayEdge } from 'model/uvx/display-edge';

export class BlockUtils {
    static isNetworkDeviceBlock(item: ItemProxy): item is NetworkDeviceBlock {
        if (item instanceof CustomBlockProxy) {
            if (item.isFromStencil(NetworkDeviceBlock.library, NetworkDeviceBlock.shape)) {
                return true;
            }
        }
        return false;
    }

    static getBlockFromGuid(page: PageProxy, guid: string): BlockProxy | undefined {
        for (const block of page.blocks.values()) {
            if (block.shapeData.get('Guid') === guid) {
                return block;
            }
        }
        return undefined;
    }

    static getGuidFromBlock(block: BlockProxy): string | undefined {
        for (const [key, val] of block.referenceKeys) {
            if (key === DEVICE_REFERENCE_KEY) {
                console.log(`key: ${key}, value: ${val.primaryKey}`);
                return removeQuotationMarks(val.primaryKey!);
            }
        }
        return undefined;
    }

    static getDeviceFromBlock(block: BlockProxy): Device | undefined {
        for (const [key, val] of block.referenceKeys) {
            if (key === DEVICE_REFERENCE_KEY) {
                return itemToDevice(val.getItem());
            }
        }
        return undefined;
    }

    static getDisplayEdgeFromLine(line: LineProxy): DisplayEdge | undefined {
        for (const [key, val] of line.referenceKeys) {
            if (key === DISPLAY_EDGE_REFERENCE_KEY) {
                return itemToDisplayEdge(val.getItem());
            }
        }
        return undefined;
    }
}
