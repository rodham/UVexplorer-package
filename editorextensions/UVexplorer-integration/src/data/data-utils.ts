import { Device, DeviceCategories, DeviceClass, DeviceLink, ProtocolProfile } from 'model/uvx/device';
import { CollectionProxy, DataItemProxy, DataProxy, EditorClient, SerializedFieldType } from 'lucid-extension-sdk';
import { DisplayEdge } from 'model/uvx/display-edge';

/**
 * Creates an instance of DataProxy.
 * @param client EditorClient
 * @returns DataProxy
 */
export function createDataProxy(client: EditorClient): DataProxy {
    return new DataProxy(client);
}

/**
 * Converts Device to Record<string, SerializedFieldType>.
 * @param device Device
 * @returns Record<string, SerializedFieldType>
 */
export function deviceToRecord(device: Device): Record<string, SerializedFieldType> {
    return {
        guid: device.guid,
        ip_address: device.ip_address,
        mac_address: device.mac_address,
        info_sets: JSON.stringify(device.info_sets),
        device_class: JSON.stringify(device.device_class),
        device_categories: JSON.stringify(device.device_categories),
        protocol_profile: JSON.stringify(device.protocol_profile),
        timestamp: device.timestamp
    };
}

/**
 * Converts DisplayEdge to Record<string, SerializedFieldType>.
 * @param displayEdge DisplayEdge
 * @returns Record<string, SerializedFieldType>
 */
export function displayEdgeToRecord(displayEdge: DisplayEdge): Record<string, SerializedFieldType> {
    return {
        local_node_id: displayEdge.nodeId1,
        remote_node_id: displayEdge.nodeId2,
        device_links: JSON.stringify(displayEdge.deviceLinks)
    };
}

/**
 * Converts DataItemProxy to Device.
 * @param item DataItemProxy
 * @returns Device
 */
export function itemToDevice(item: DataItemProxy): Device {
    return new Device(
        item.fields.get('ip_address')?.toString() ?? '',
        item.fields.get('mac_address')?.toString() ?? '',
        item.fields.get('guid')?.toString() ?? '',
        JSON.parse(item.fields.get('info_sets')?.toString() ?? ''),
        JSON.parse(item.fields.get('device_class')?.toString() ?? '') as DeviceClass,
        JSON.parse(item.fields.get('device_categories')?.toString() ?? '') as DeviceCategories,
        JSON.parse(item.fields.get('protocol_profile')?.toString() ?? '') as ProtocolProfile,
        item.fields.get('timestamp')?.toString() ?? ''
    );
}

/**
 * Converts DataItemProxy to DisplayEdge.
 * @param item DataItemProxy
 * @returns DisplayEdge
 */
export function itemToDisplayEdge(item: DataItemProxy): DisplayEdge {
    return new DisplayEdge(
        Number.parseInt(item.fields.get('local_node_id')?.toString() ?? ''),
        Number.parseInt(item.fields.get('remote_node_id')?.toString() ?? ''),
        JSON.parse(item.fields.get('device_links')?.toString() ?? '') as DeviceLink[]
    );
}

/**
 * Converts CollectionProxy to list of devices (Device[])
 * @param collection CollectionProxy
 * @returns list of devices (Device[])
 */
export function collectionToDevices(collection: CollectionProxy): Device[] {
    const devices: Device[] = [];
    for (const key of collection.items.keys()) {
        devices.push(itemToDevice(collection.items.get(key)));
    }
    return devices;
}

/**
 * Converts a given string to snake case.
 * @param val string
 * @returns string
 */
export function toSnakeCase(val: string): string {
    return val
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase();
}

/**
 * Removes quotation marks from given string (needed because Lucid's Data Collection adds quotation marks to primary keys)
 * @param val string
 * @returns string
 */
export function removeQuotationMarks(val: string): string {
    return val.replace(/['"]/g, '');
}

/**
 * Adds quotation marks to given string (needed because Lucid's Data Collection needs primary keys to have quotation marks)
 * @param val string
 * @returns string
 */
export function addQuotationMarks(val: string): string {
    return '"' + val + '"';
}
