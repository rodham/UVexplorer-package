import {
    BlockProxy,
    CustomBlockProxy,
    EditorClient,
    ItemProxy,
    LineShape,
    PageProxy,
    Viewport
} from 'lucid-extension-sdk';
import { DeviceLink } from 'model/bundle/code/dtos/topology/DeviceLink';
import { DeviceNode } from 'model/bundle/code/dtos/topology/DeviceNode';
import { Device } from 'model/uvexplorer-model';

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
            return deviceTypeNameMap.get(category);
        }
    }

    return 'unknown';
}

function getCompany(device: Device) {
    const info_sets = device.info_sets;
    let company = '';
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

    if (companyNameMap.has(company)) {
        return companyNameMap.get(company);
    } else {
        console.error('Unknown company name');
        return 'unknown';
    }
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

export async function drawBlocks(
    client: EditorClient,
    viewport: Viewport,
    devices: Device[],
    deviceNodes: DeviceNode[]
) {
    const customBlockDef = await client.getCustomShapeDefinition(LIBRARY, SHAPE);

    if (!customBlockDef) {
        return;
    }

    const page = viewport.getCurrentPage();
    if (page != undefined) {
        for (const device of devices) {
            const deviceNode = deviceNodes.filter((node) => node.deviceGuid === device.guid);

            const block = page.addBlock({
                ...customBlockDef,
                boundingBox: { x: deviceNode[0].x, y: deviceNode[0].y, w: 50, h: 50 }
            });
            block.shapeData.set('Make', getCompany(device));
            block.shapeData.set('DeviceType', getDeviceType(device));
            block.shapeData.set('Guid', device.guid);

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
        if (block.shapeData.get('Guid') === guid) {
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
