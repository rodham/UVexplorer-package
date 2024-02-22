import {
    BlockDefinition,
    BlockProxy,
    CustomBlockProxy,
    EditorClient,
    ItemProxy,
    LineShape,
    PageProxy,
    Viewport
} from 'lucid-extension-sdk';
import { Device, DeviceNode, DeviceLink } from 'model/uvexplorer-model';
import { Data } from '@data/data';
import { itemToDevice, removeQuotationMarks } from '@data/data-utils';
import { NetworkDeviceBlock } from './network-device-block';

const LIBRARY = 'UVexplorer-shapes';
const SHAPE = 'networkDevice';
const DEVICE_REFERENCE_KEY = 'device_reference_key';

export function isNetworkDeviceBlock(item: ItemProxy): item is NetworkDeviceBlock {
    if (item instanceof CustomBlockProxy) {
        if (item.isFromStencil(LIBRARY, SHAPE)) {
            return true;
        }
    }
    return false;
}

export function getBlockFromGuid(page: PageProxy, guid: string): BlockProxy | undefined {
    for (const block of page.blocks.values()) {
        if (block.shapeData.get('Guid') === guid) {
            return block;
        }
    }
    return undefined;
}

export function getGuidFromBlock(block: BlockProxy): string | undefined {
    for (const [key, val] of block.referenceKeys) {
        if (key === DEVICE_REFERENCE_KEY) {
            return removeQuotationMarks(val.primaryKey!);
        }
    }
    return undefined;
}

export function getDeviceFromBlock(block: BlockProxy): Device | undefined {
    for (const [key, val] of block.referenceKeys) {
        if (key === DEVICE_REFERENCE_KEY) {
            return itemToDevice(val.getItem());
        }
    }
    return undefined;
}

function findCategory(deviceTypes: Set<string>) {
    const orderedPrimaryCategories = [
        'net-device',
        'firewall',
        'router',
        'switch',
        'printer',
        'wireless-controller',
        'wireless-ap',
        'virtual-server',
        'virtual-switch',
        'virtual-port-group',
        'ip-phone',
        'ip-phone-manager',
        'server',
        'workstation',
        'windows',
        'windows-server',
        'ip_camera_cctv',
        'virtual-port-group',
        'wireless-client'
    ];

    for (const category of orderedPrimaryCategories) {
        if (deviceTypes.has(category)) {
            return deviceTypeNameMap.get(category);
        }
    }

    return 'unknown';
}

function getCompany(deviceNode: DeviceNode) {
    let company = '';
    if (deviceNode.vendor !== undefined) {
        company = deviceNode.vendor;
    }

    if (companyNameMap.has(company)) {
        return companyNameMap.get(company);
    } else {
        console.error('Unknown company name: ' + company);
        return 'unknown';
    }
}

function getDeviceType(deviceNode: DeviceNode) {
    const deviceTypes = new Set<string>();
    if (deviceNode.categories.entries !== undefined) {
        deviceNode.categories.entries.forEach((type) => {
            deviceTypes.add(type.categoryName);
        });
    }

    console.log(deviceNode);

    return findCategory(deviceTypes);
}

export async function drawBlocks(
    client: EditorClient,
    viewport: Viewport,
    deviceNodes: DeviceNode[]
) {
    const page = viewport.getCurrentPage();
    if (page != undefined) {
        const customBlockDef = await client.getCustomShapeDefinition(LIBRARY, SHAPE);
        if (!customBlockDef) {
            return;
        }

        const addedBlocks: BlockProxy[] = [];
        for (const deviceNode of deviceNodes) {
            const block = page.addBlock({
                ...customBlockDef,
                boundingBox: { x: deviceNode.x, y: deviceNode.y, w: 50, h: 50 }
            });

            block.shapeData.set('Make', getCompany(deviceNode));
            block.shapeData.set('DeviceType', getDeviceType(deviceNode));
            block.shapeData.set('Guid', deviceNode.deviceGuid);

            const data = Data.getInstance(client);
            const networkGuid = data.getNetworkForPage(page.id);
            const source = data.createOrRetrieveNetworkSource('', networkGuid);
            const collection = data.createOrRetrieveDeviceCollection(source);
            block.setReferenceKey(DEVICE_REFERENCE_KEY, {
                collectionId: collection.id,
                primaryKey: `"${deviceNode.deviceGuid}"`,
                readonly: true
            });
            addedBlocks.push(block);
        }
        viewport.focusCameraOnItems(addedBlocks);
    }
}

export function drawLinks(client: EditorClient, viewport: Viewport, deviceLinks: DeviceLink[]) {
    const page = viewport.getCurrentPage();
    if (page !== undefined) {
        for (const link of deviceLinks) {
            for (const linkMembers of link.linkMembers) {
                const deviceBlock = getBlockFromGuid(page, linkMembers.deviceGuid);
                const connectedDeviceBlock = getBlockFromGuid(page, linkMembers.connectedDeviceGuid);
                if (deviceBlock !== undefined && connectedDeviceBlock !== undefined) {
                    if (deviceBlock.getBoundingBox().y > connectedDeviceBlock.getBoundingBox().y) {
                        connectBlocks(connectedDeviceBlock, deviceBlock);
                    } else {
                        connectBlocks(deviceBlock, connectedDeviceBlock);
                    }
                }
            }
        }
    }
}

function connectBlocks(block1: BlockProxy, block2: BlockProxy) {
    const line = block1.getPage().addLine({
        endpoint1: {
            connection: block1,
            linkX: 0.5,
            linkY: 1,
            style: 'none'
        },
        endpoint2: {
            connection: block2,
            linkX: 0.5,
            linkY: 0,
            style: 'none'
        }
    });
    line.setShape(LineShape.Diagonal);
}

const deviceTypeNameMap: Map<string, string> = new Map<string, string>([
    ['router', 'router'],
    ['switch', 'switch'],
    ['server', 'server'],
    ['firewall', 'firewall'],
    ['ip-phone', 'phone'],
    ['ip-phone-manager', 'phoneManager'],
    ['ip_camera_cctv', 'ipCameraCctv'],
    ['windows', 'workstation'],
    ['windows-server', 'server'],
    ['printer', 'printer'],
    ['hub', 'hub'],
    ['wireless-ap', 'wirelessAP'],
    ['wireless-controller', 'wirelessController'],
    ['workstation', 'workstation'],
    ['net-device', 'networkDevice'],
    ['wireless-client', 'wirelessClient'],
    ['virtual-server', 'server'],
    ['virtual-switch', 'switch'],
    ['virtual-port-group', 'virtualPortGroup'],
    ['', 'unknown']
]);

const companyNameMap: Map<string, string> = new Map<string, string>([
    ['Arista Networks', 'arista'],
    ['Cisco', 'cisco'],
    ['Meraki', 'meraki'],
    ['Microsoft', 'microsoft'],
    ['Dell', 'dell'],
    ['Hewlett Packard', 'hewlettPackard'],
    ['HPN Supply Chain', 'hewlettPackard'],
    ['Hirschmann Automation', 'hirschmann'],
    ['Hirschmann Automation and Control GmbH', 'hirschmann'],
    ['Huawei', 'huawei'],
    ['Juniper', 'juniper'],
    ['VMware', 'vmware'],
    ['VMware, Inc', 'vmware'],
    ['VMware, Inc.', 'vmware'],
    ['Aruba', 'aruba'],
    ['Motorola', 'motorola'],
    ['Apple', 'apple'],
    ['Avaya', 'avaya'],
    ['Brocade Communications Systems LLC', 'brocade'],
    ['Extreme', 'extreme'],
    ['Enterasys', 'enterasys'],
    ['Westermo', 'westermo'],
    ['NETGEAR', 'netgear'],
    ['Ruckus Wireless', 'ruckus'],
    ['Rockwell Automation', 'rockwella'],
    ['Checkpoint Systems, Inc.', 'checkpoint'],
    ['Check Point Software Technologies', 'checkpoint'],
    ['D-Link', 'dlink'],
    ['Ubiquiti Networks Inc.', 'ubiquiti'],
    ['Ubiquiti', 'ubiquiti'],
    ['Mellanox Technologies, Inc.', 'mellanox'],
    ['Fortinet, Inc.', 'fortinet'],
    ['Foundry', 'brocade'],
    ['TP-LINK TECHNOLOGIES CO.,LTD.', 'tpLink'],
    ['', 'unknown']
]);
