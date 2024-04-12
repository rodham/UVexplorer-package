import { DeviceNode } from './device';

export const DEVICE_TYPE_NAME_MAP: Map<string, string> = new Map<string, string>([
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

/**
 * Finds and returns the category in the given deviceTypes with the highest priority.
 * @param deviceTypes Set<string>
 * @returns string
 */
export function findCategory(deviceTypes: Set<string>) {
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
            return DEVICE_TYPE_NAME_MAP.get(category);
        }
    }

    return 'unknown';
}

/**
 * Finds and returns the device category for the given deviceNode.
 * @param deviceNode DeviceNode
 * @returns string
 */
export function getDeviceType(deviceNode: DeviceNode) {
    const deviceTypes = new Set<string>();
    if (deviceNode.categories.entries !== undefined) {
        deviceNode.categories.entries.forEach((type) => {
            deviceTypes.add(type.categoryName);
        });
    }

    return findCategory(deviceTypes);
}
