import { EditorClient, Viewport } from 'lucid-extension-sdk';
import { Device } from 'model/uvexplorer-model';
import {
    createOrRetrieveDeviceCollection,
    createOrRetrieveNetworkSource,
    getNetworkForPage
} from '../data-collections';
import { DeviceNode } from 'model/bundle/code/dtos/topology/DeviceNode';

const LIBRARY = 'UVexplorer-shapes';
const SHAPE = 'networkDevice'

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
                boundingBox: { x: deviceNode[0].x, y: deviceNode[0].y, w: 150, h: 150 }
            });
            block.shapeData.set('make', getCompany(device));
            block.shapeData.set('deviceType', getDeviceType(device));

            const networkGuid = getNetworkForPage(page.id);
            const source = createOrRetrieveNetworkSource('', networkGuid);
            const collection = createOrRetrieveDeviceCollection(source);

            block.setReferenceKey('device_reference_key', {
                collectionId: collection.id,
                primaryKey: device.guid,
                readonly: true,
            });
        }
    }
}
