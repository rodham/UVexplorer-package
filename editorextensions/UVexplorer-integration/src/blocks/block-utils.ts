import { BlockProxy, CustomBlockProxy, ItemProxy, LineProxy, PageProxy } from 'lucid-extension-sdk';
import { Device } from 'model/uvx/device';
import { DEVICE_REFERENCE_KEY, DISPLAY_EDGE_REFERENCE_KEY } from '@data/data-client';
import { itemToDevice, itemToDisplayEdge, removeQuotationMarks } from '@data/data-utils';
import { NetworkDeviceBlock } from './network-device-block';
import { DisplayEdge } from 'model/uvx/display-edge';
import { HUB_NODE } from 'model/uvx/hub-node';

/**
 * Class with utility functions for our custom NetworkDeviceBlock.
 */
export class BlockUtils {
    /**
     * Checks if an item within LucidChart is our custom NetworkDeviceBlock.
     * @param item ItemProxy
     * @returns boolean
     */
    static isNetworkDeviceBlock(item: ItemProxy): item is NetworkDeviceBlock {
        if (item instanceof CustomBlockProxy) {
            if (item.isFromStencil(NetworkDeviceBlock.library, NetworkDeviceBlock.shape)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if an item within LucidChart is our custom NetworkDeviceBlock and a hub node.
     * @param item ItemProxy
     * @returns boolean
     */
    static isHubNodeBlock(item: ItemProxy): boolean {
        if (this.isNetworkDeviceBlock(item)) {
            if (item.shapeData.get('Guid') === HUB_NODE) {
                return true;
            }
        }
        return false;
    }

    /**
     * Retrieves a block from a given guid.
     * @param page PageProxy
     * @param guid string
     * @returns BlockProxy or undefined
     */
    static getBlockFromGuid(page: PageProxy, guid: string): BlockProxy | undefined {
        for (const block of page.blocks.values()) {
            if (block.shapeData.get('Guid') === guid) {
                return block;
            }
        }
        return undefined;
    }

    /**
     * Retrieves a block's guid from a given block.
     * @param block BlockProxy
     * @returns guid as string or undefined
     */
    static getGuidFromBlock(block: BlockProxy): string | undefined {
        for (const [key, val] of block.referenceKeys) {
            if (key === DEVICE_REFERENCE_KEY) {
                console.log(`key: ${key}, value: ${val.primaryKey}`);
                return removeQuotationMarks(val.primaryKey!);
            }
        }
        return undefined;
    }

    /**
     * Creates and returns a Device from a given block.
     * @param block BlockProxy
     * @returns Device or undefined
     */
    static getDeviceFromBlock(block: BlockProxy): Device | undefined {
        for (const [key, val] of block.referenceKeys) {
            if (key === DEVICE_REFERENCE_KEY) {
                return itemToDevice(val.getItem());
            }
        }
        return undefined;
    }

    /**
     * Creates and returns a DisplayEdge from a given line.
     * @param line LineProxy
     * @returns DisplayEdge or undefined
     */
    static getDisplayEdgeFromLine(line: LineProxy): DisplayEdge | undefined {
        for (const [key, val] of line.referenceKeys) {
            if (key === DISPLAY_EDGE_REFERENCE_KEY) {
                return itemToDisplayEdge(val.getItem());
            }
        }
        return undefined;
    }

    /**
     * Retrieves all device guids connected to a block (skipping over a single hub node, if present)
     * @param block NetworkDeviceBlock
     * @param prevGuid string (optionally undefined)
     * @returns list of guid strings
     */
    static getVisibleConnectedDeviceGuidsFromBlock(block: NetworkDeviceBlock, prevGuid?: string): string[] {
        const visConnDeviceGuids: string[] = [];
        const blockGuid = block.shapeData.get('Guid');
        if (!blockGuid || typeof blockGuid !== 'string') {
            console.log('Problem getting shapeData guid from item');
            return [];
        }

        const connectedLines = block.getConnectedLines();

        for (const line of connectedLines) {
            const endpoint1 = line.getEndpoint1().connection;
            const endpoint2 = line.getEndpoint2().connection;
            if (
                !endpoint1 ||
                !BlockUtils.isNetworkDeviceBlock(endpoint1) ||
                !endpoint2 ||
                !BlockUtils.isNetworkDeviceBlock(endpoint2)
            ) {
                continue;
            }

            const endpointGuid1 = endpoint1.shapeData.get('Guid');
            const endpointGuid2 = endpoint2.shapeData.get('Guid');

            if (
                endpointGuid1 &&
                typeof endpointGuid1 === 'string' &&
                endpointGuid1 !== blockGuid &&
                endpointGuid1 !== prevGuid
            ) {
                if (endpointGuid1 === HUB_NODE) {
                    visConnDeviceGuids.push(...this.getVisibleConnectedDeviceGuidsFromBlock(endpoint1, blockGuid));
                } else {
                    visConnDeviceGuids.push(endpointGuid1);
                }
            }
            if (
                endpointGuid2 &&
                typeof endpointGuid2 === 'string' &&
                endpointGuid2 !== blockGuid &&
                endpointGuid2 !== prevGuid
            ) {
                if (endpointGuid2 === HUB_NODE) {
                    visConnDeviceGuids.push(...this.getVisibleConnectedDeviceGuidsFromBlock(endpoint2, blockGuid));
                } else {
                    visConnDeviceGuids.push(endpointGuid2);
                }
            }
        }
        return visConnDeviceGuids;
    }
}
