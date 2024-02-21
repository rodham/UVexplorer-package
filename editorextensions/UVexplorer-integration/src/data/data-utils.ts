import { Device, DeviceCategories, DeviceClass, ProtocolProfile } from 'model/uvexplorer-model';
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
