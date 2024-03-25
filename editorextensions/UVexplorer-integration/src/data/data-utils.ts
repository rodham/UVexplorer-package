import {
    Device,
    DeviceCategories,
    DeviceClass,
    DeviceConnection,
    DeviceFilter,
    DeviceLinkEdge,
    ProtocolProfile
} from 'model/uvx/device';
import { CollectionProxy, DataItemProxy, DataProxy, EditorClient, SerializedFieldType } from 'lucid-extension-sdk';

export function createDataProxy(client: EditorClient): DataProxy {
    return new DataProxy(client);
}

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

export function linkEdgeToRecord(link: DeviceLinkEdge): Record<string, SerializedFieldType> {
    return {
        local_device_guid: link.localConnection.deviceGuid,
        remote_device_guid: link.remoteConnection.deviceGuid,
        local_connection: JSON.stringify(link.localConnection),
        remote_connection: JSON.stringify(link.remoteConnection)
    };
}

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

export function itemToLinkEdge(item: DataItemProxy): DeviceLinkEdge {
    return new DeviceLinkEdge(
        JSON.parse(item.fields.get('local_connection')?.toString() ?? '') as DeviceConnection,
        JSON.parse(item.fields.get('remote_connection')?.toString() ?? '') as DeviceConnection
    );
}

export function collectionToDevices(collection: CollectionProxy): Device[] {
    const devices: Device[] = [];
    for (const key of collection.items.keys()) {
        devices.push(itemToDevice(collection.items.get(key)));
    }
    return devices;
}

export function toSnakeCase(val: string): string {
    return val
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase();
}

export function removeQuotationMarks(val: string): string {
    return val.replace(/['"]/g, '');
}

export function addQuotationMarks(val: string): string {
    return '"' + val + '"';
}
