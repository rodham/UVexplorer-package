import { Device } from 'model/uvexplorer-model';
import {
    CollectionProxy,
    DataProxy,
    DataSourceProxy,
    EditorClient,
    ScalarFieldTypeEnum, SchemaDefinition,
    SerializedFieldType
} from 'lucid-extension-sdk';
import {createDataProxy, deviceToRecord, toSnakeCase} from "@data/data-utils";

export const DEVICE_SCHEMA: SchemaDefinition = {
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
    primaryKey: ['guid']
}

export class Data {
    private static instance: Data;
    private data: DataProxy;

    constructor(client: EditorClient) {
        this.data = createDataProxy(client);
    }

    static getInstance(client: EditorClient): Data {
        if (!Data.instance) {
            Data.instance = new Data(client);
        }
        return Data.instance;
    }

    createOrRetrieveNetworkSource(name: string, guid: string): DataSourceProxy {
        for (const [, source] of this.data.dataSources) {
            if (source.getSourceConfig().guid === guid) {
                return source;
            }
        }
        return this.data.addDataSource(name, { guid: guid });
    }

    createOrRetrieveDeviceCollection(source: DataSourceProxy): CollectionProxy {
        for (const [, collection] of source.collections) {
            if (collection.getName() === `${toSnakeCase(source.getName())}_device`) {
                return collection;
            }
        }
        return source.addCollection(`${toSnakeCase(source.getName())}_device`, DEVICE_SCHEMA);
    }

    addDevicesToCollection(collection: CollectionProxy, devices: Device[]) : void {
        collection.patchItems({
            added: devices.map((d) => deviceToRecord(d))
        });
    }

    deleteDevicesFromCollection(collection: CollectionProxy) : void {
        const guids = collection.items.keys();
        collection.patchItems({
            deleted: guids
        });
    }

    createOrRetrievePageMapSource(): DataSourceProxy {
        for (const [, source] of this.data.dataSources) {
            if (source.getSourceConfig().id === 'PageMap') {
                return source;
            }
        }
        return this.data.addDataSource('PageMap', { id: 'PageMap' });
    }

    createOrRetrievePageMapCollection() : CollectionProxy {
        const source = this.createOrRetrievePageMapSource();
        for (const [, collection] of source.collections) {
            if (collection.getName() === 'page_map') {
                return collection;
            }
        }
        return source.addCollection('page_map', {
            fields: [
                { name: 'page_id', type: ScalarFieldTypeEnum.STRING },
                { name: 'network_guid', type: ScalarFieldTypeEnum.STRING }
            ],
            primaryKey: ['page_id']
        });
    }

    updatePageMap(pageId: string, networkGuid: string) : void {
        const collection = this.createOrRetrievePageMapCollection();

        for (const [key, item] of collection.items) {
            if (item.fields.get('page_id') === pageId) {
                const map = new Map<string, Record<string, SerializedFieldType>>();
                map.set(key, { page_id: pageId, network_guid: networkGuid });
                collection.patchItems({
                    changed: map
                });
                return;
            }
        }

        collection.patchItems({
            added: [{ page_id: pageId, network_guid: networkGuid }]
        });
    }

    getNetworkForPage(pageId: string): string {
        const collection = this.createOrRetrievePageMapCollection();
        for (const [, item] of collection.items) {
            if (item.fields.get('page_id') === pageId) {
                const networkGuid: SerializedFieldType = item.fields.get('network_guid');
                if (typeof networkGuid === 'string') {
                    return networkGuid.toString();
                }
            }
        }
        throw new Error('Could not retrieve the network associated with the current page.');
    }
}





