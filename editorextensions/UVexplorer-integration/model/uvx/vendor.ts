import {DeviceNode} from "./device";

export const VENDOR_NAME_MAP: Map<string, string> = new Map<string, string>([
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


export function getVendor(deviceNode: DeviceNode) {
    let vendor = '';
    if (deviceNode.vendor !== undefined) {
        vendor = deviceNode.vendor;
    }

    if (VENDOR_NAME_MAP.has(vendor)) {
        return VENDOR_NAME_MAP.get(vendor);
    } else {
        console.error('Unknown vendor name: ' + vendor);
        return 'unknown';
    }
}

