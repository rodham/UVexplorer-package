import {
    Device,
    DeviceCategories,
    DeviceClass,
    DeviceLink, DeviceLinkEdge,
    DeviceLinkMember, MonitorState,
    ProtocolProfile
} from 'model/uvexplorer-devices-model';
import {
    CollectionProxy,
    DataItemProxy,
    DataProxy,
    EditorClient,
    SerializedFieldType
} from 'lucid-extension-sdk';

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

export function linkToRecord(link: DeviceLink): Record<string, SerializedFieldType> {
    return {
        link_type: link.linkType,
        no_wireless: link.noWireless,
        all_wireless_or_vm: link.allWirelessOrVm,
        no_vm: link.noVm,
        link_members: JSON.stringify(link.linkMembers),
        link_edges: JSON.stringify(link.linkEdges),
        monitor_state: link.monitorState
    }
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

    export function itemToLink(item: DataItemProxy): DeviceLink {
        return new DeviceLink(
            item.fields.get('link_type')?.toString() ?? '',
            !item.fields.get('no_wireless'),
            !item.fields.get('all_wireless_or_vm'),
            !item.fields.get('no_vm'),
            JSON.parse(item.fields.get('link_members')?.toString() ?? '') as DeviceLinkMember[],
            JSON.parse(item.fields.get('link_edges')?.toString() ?? '') as DeviceLinkEdge[],
            item.fields.get('monitor_state') as MonitorState
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
