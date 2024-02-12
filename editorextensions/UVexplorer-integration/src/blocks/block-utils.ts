import { BlockProxy, CustomBlockProxy, EditorClient, ItemProxy, PageProxy, Viewport } from 'lucid-extension-sdk';
import { Device } from 'model/uvexplorer-model';
import { DeviceNode } from 'model/bundle/code/dtos/topology/DeviceNode';
import { DeviceLink } from 'model/bundle/code/dtos/topology/DeviceLink';

const LIBRARY = 'UVexplorer-shapes';
const SHAPE = 'networkDevice';

export function isNetworkDeviceBlock(item: ItemProxy) {
    if (item instanceof CustomBlockProxy) {
        if (item.isFromStencil(LIBRARY, SHAPE)) {
            return true;
        }
    }
    return false;
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
            return category;
        }
    }

    return 'unknown-device';
}

function getCompany(device: Device) {
    const info_sets = device.info_sets;
    let company = 'unknown-make';
    if (typeof info_sets === 'object' && info_sets !== null) {
        if (
            'product_info' in info_sets &&
            typeof info_sets.product_info === 'object' &&
            info_sets.product_info !== null
        ) {
            if ('vendor' in info_sets.product_info && typeof info_sets.product_info.vendor === 'string') {
                company = info_sets.product_info.vendor;
            }
        }
    }
    return company;
}

function getDeviceType(device: Device) {
    const deviceTypes = new Set<string>();
    if (device.device_categories.entries !== undefined) {
        device.device_categories.entries.forEach((type) => {
            deviceTypes.add(type.device_category);
        });
    }

    return findCategory(deviceTypes);
}

export async function drawBlocks(client: EditorClient, viewport: Viewport, devices: Device[], deviceNodes: DeviceNode[]) {
    const customBlockDef = await client.getCustomShapeDefinition(LIBRARY, SHAPE);

    if (!customBlockDef) {
        return;
    }

    const page = viewport.getCurrentPage();
    if (page != undefined) {
        for (const device of devices) {
            const deviceNode = deviceNodes.filter(node => node.deviceGuid === device.guid);

            const block = page.addBlock({
                ...customBlockDef,
                boundingBox: { x: deviceNode[0].x, y: deviceNode[0].y, w: 50, h: 50 }
            });
            block.shapeData.set('make', getCompany(device));
            block.shapeData.set('deviceType', getDeviceType(device));
            block.shapeData.set('guid', device.guid);

            // TODO: Figure out why setting the reference key throws JSON parsing errors
            // const networkGuid = getNetworkForPage(page.id);
            // const source = createOrRetrieveNetworkSource('', networkGuid);
            // const collection = createOrRetrieveDeviceCollection(source);
            // block.setReferenceKey('device_reference_key', {
            //     collectionId: collection.id,
            //     primaryKey: device.guid,
            //     readonly: true,
            // });
        }
    }
}

function getBlockFromGuid(page: PageProxy, guid: string): BlockProxy | undefined {
    for (const block of page.blocks.values()) {
        if (block.shapeData.get('guid') === guid) {
            return block;
        }
    }
    return undefined;
}

export function drawLinks(client: EditorClient, viewport: Viewport, deviceLinks: DeviceLink[]) {
    const page = viewport.getCurrentPage();
    if (page !== undefined) {
        for (const link of deviceLinks) {
            for (const linkMembers of link.linkMembers) {
                console.log(linkMembers);
                const deviceBlock = getBlockFromGuid(page, linkMembers.deviceGuid);
                const connectedDeviceBlock = getBlockFromGuid(page, linkMembers.connectedDeviceGuid);
                if (deviceBlock !== undefined && connectedDeviceBlock !== undefined) {
                    connectBlocks(deviceBlock, connectedDeviceBlock);
                }
            }
        }
    }
}

function connectBlocks(block1: BlockProxy, block2: BlockProxy) {
    block1.getPage().addLine({
        endpoint1: {
            connection: block1,
            linkX: 0.5,
            linkY: 1,
        },
        endpoint2: {
            connection: block2,
            linkX: 0.5,
            linkY: 0,
        },
    });
}


