import { Device, DeviceCategories, DeviceClass, ProtocolProfile } from '../model/uvexplorer-model';
import {
    CollectionProxy, DataItemProxy,
    DataProxy,
    DataSourceProxy,
    EditorClient,
    ScalarFieldTypeEnum, SerializedFieldType
} from 'lucid-extension-sdk';

const client = new EditorClient();
const data = new DataProxy(client);

export function createOrRetrieveNetworkSource(name: string, guid:string) {
    for (const [, source] of data.dataSources) {
        if (source.getSourceConfig().guid === guid) {
            return source
        }
    }
    return data.addDataSource(name, {'guid': guid})
}

function toSnakeCase(val: string): string {
    return val.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_').toLowerCase();
}

export function createOrRetrieveDeviceCollection(source: DataSourceProxy) {
    for (const [, collection] of source.collections) {
        if (collection.getName() === `${toSnakeCase(source.getName())}_device`) {
            return collection;
        }
    }
    return source.addCollection(`${toSnakeCase(source.getName())}_device`, {
        fields: [
            { name: 'guid', type: ScalarFieldTypeEnum.STRING },
            { name: 'ip_address', type: ScalarFieldTypeEnum.STRING },
            { name: 'mac_address', type: ScalarFieldTypeEnum.STRING },
            { name: 'info_sets', type: ScalarFieldTypeEnum.STRING },
            { name: 'device_class', type: ScalarFieldTypeEnum.STRING },
            { name: 'device_categories', type: ScalarFieldTypeEnum.STRING },
            { name: 'protocol_profile', type: ScalarFieldTypeEnum.STRING },
            { name: 'timestamp', type: ScalarFieldTypeEnum.STRING }
        ],
        primaryKey: ['guid'],
    });
}

export function addDevicesToCollection(collection: CollectionProxy, devices: Device[]) {
    collection.patchItems({
        added: devices.map((d)=> deviceToRecord(d))
    });
}

export function deviceToRecord(device: Device): Record<string, SerializedFieldType> {
    return {
        'guid': device.guid,
        'ip_address': device.ip_address,
        'mac_address': device.mac_address,
        'info_sets': JSON.stringify(device.info_sets),
        'device_class': JSON.stringify(device.device_class),
        'device_categories': JSON.stringify(device.device_categories),
        'protocol_profile': JSON.stringify(device.protocol_profile),
        'timestamp': device.timestamp
    }
}

export function itemToDevice(item: DataItemProxy): Device {
    return new Device(
        item.fields.get('ip_address')?.toString() ?? '',
        item.fields.get('mac_address')?.toString() ?? '',
        item.fields.get('guid')?.toString() ?? '',
        JSON.parse(item.fields.get('info_sets')?.toString() ?? ''),
        (JSON.parse(item.fields.get('device_class')?.toString() ?? '') as DeviceClass),
        (JSON.parse(item.fields.get('device_categories')?.toString() ?? '') as DeviceCategories),
        (JSON.parse(item.fields.get('protocol_profile')?.toString() ?? '') as ProtocolProfile),
        item.fields.get('timestamp')?.toString() ?? ''
    )
}

export function collectionToDevices(collection: CollectionProxy): Device[] {
    const devices: Device[] = [];
    for (const key of collection.items.keys()) {
        devices.push(itemToDevice(collection.items.get(key)));
    }
    return devices;
}
