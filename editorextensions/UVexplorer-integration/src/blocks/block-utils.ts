import { BlockProxy, CustomBlockProxy, ItemProxy, LineProxy, PageProxy } from 'lucid-extension-sdk';
import { Device, DeviceLinkEdge } from 'model/uvx/device';
import { DEVICE_REFERENCE_KEY, LINK_REFERENCE_KEY } from '@data/data-client';
import { itemToDevice, itemToLinkEdge, removeQuotationMarks } from '@data/data-utils';
import { NetworkDeviceBlock } from './network-device-block';

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

    static getLinkInfoFromLine(line: LineProxy): DeviceLinkEdge | undefined {
        for (const [key, val] of line.referenceKeys) {
            if (key === LINK_REFERENCE_KEY) {
                return itemToLinkEdge(val.getItem());
            }
        }
        return undefined;
    }
}
