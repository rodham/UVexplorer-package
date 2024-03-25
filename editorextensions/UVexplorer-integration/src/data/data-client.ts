import { Device, DeviceFilter, DeviceLink, DeviceLinkEdge } from 'model/uvx/device';
import {
    CollectionProxy,
    DataProxy,
    DataSourceProxy,
    EditorClient,
    ScalarFieldTypeEnum,
    SchemaDefinition,
    SerializedFieldType
} from 'lucid-extension-sdk';
import { createDataProxy, deviceToRecord, linkEdgeToRecord, toSnakeCase, addQuotationMarks } from '@data/data-utils';
import {
    DrawSettings,
    LayoutSettings,
    defaultDrawSettings,
    defaultLayoutSettings,
    ImageSettings,
    defaultImageSettings
} from 'model/uvx/topo-map';
export const DEVICE_REFERENCE_KEY = 'device_reference_key';
export const LINK_REFERENCE_KEY = 'link_reference_key';

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
};

export const LINK_SCHEMA: SchemaDefinition = {
    fields: [
        { name: 'local_device_guid', type: ScalarFieldTypeEnum.STRING },
        { name: 'remote_device_guid', type: ScalarFieldTypeEnum.STRING },
        { name: 'local_connection', type: ScalarFieldTypeEnum.STRING },
        { name: 'remote_connection', type: ScalarFieldTypeEnum.STRING }
    ],
    primaryKey: ['local_device_guid', 'remote_device_guid']
};

export const SETTINGS_SCHEMA: SchemaDefinition = {
    fields: [
        { name: 'page_id', type: ScalarFieldTypeEnum.STRING },
        { name: 'layout_settings', type: ScalarFieldTypeEnum.STRING },
        { name: 'draw_settings', type: ScalarFieldTypeEnum.STRING },
        { name: 'image_settings', type: ScalarFieldTypeEnum.STRING }
    ],
    primaryKey: ['page_id']
};

export const DEVICE_FILTER_SCHEMA: SchemaDefinition = {
    fields: [
        { name: 'device_filter', type: ScalarFieldTypeEnum.STRING }
    ],
    primaryKey: ['page_id']
}

export class DataClient {
    private static instance: DataClient;
    private data: DataProxy;

    constructor(client: EditorClient) {
        this.data = createDataProxy(client);
    }

    static getInstance(client: EditorClient): DataClient {
        if (!DataClient.instance) {
            DataClient.instance = new DataClient(client);
        }
        return DataClient.instance;
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

    createOrRetrieveLinkCollection(source: DataSourceProxy): CollectionProxy {
        for (const [, collection] of source.collections) {
            if (collection.getName() === `${toSnakeCase(source.getName())}_link`) {
                return collection;
            }
        }
        return source.addCollection(`${toSnakeCase(source.getName())}_link`, LINK_SCHEMA);
    }

    createOrRetrieveDeviceFilterCollection(source: DataSourceProxy): CollectionProxy {
        for (const [, collection] of source.collections) {
            if (collection.getName() === `${toSnakeCase(source.getName())}_filter`) {
                return collection;
            }
        }
        return source.addCollection(`${toSnakeCase(source.getName())}_filter`, DEVICE_FILTER_SCHEMA);
    }

    addDevicesToCollection(collection: CollectionProxy, devices: Device[]): void {
        collection.patchItems({
            added: devices.map(deviceToRecord)
        });
    }

    clearCollection(collection: CollectionProxy): void {
        const guids = collection.items.keys();
        collection.patchItems({
            deleted: guids
        });
    }

    clearPartOfCollection(collection: CollectionProxy, removeDevices: string[]): void {
        collection.patchItems({
            deleted: removeDevices
        });
    }

    addLinksToCollection(collection: CollectionProxy, links: DeviceLink[]): void {
        const linkEdges: DeviceLinkEdge[] = links.flatMap((link) => link.linkEdges);
        collection.patchItems({
            added: linkEdges.map(linkEdgeToRecord)
        });
    }

    addSettingsToCollection(
        collection: CollectionProxy,
        pageId: string,
        layoutSettings: LayoutSettings,
        drawSettings: DrawSettings,
        imageSettings: ImageSettings
    ) {
        collection.patchItems({
            added: [
                {
                    page_id: pageId,
                    layout_settings: JSON.stringify(layoutSettings),
                    draw_settings: JSON.stringify(drawSettings),
                    image_settings: JSON.stringify(imageSettings)
                }
            ]
        });
    }

    addDeviceFilterToCollection(collection: CollectionProxy, filter: DeviceFilter) {
        collection.patchItems({
            added: [
                {
                    device_filter: JSON.stringify(filter)
                }
            ]
        });
    }

    deleteSettingsFromCollection(collection: CollectionProxy, pageId: string): void {
        const key = addQuotationMarks(pageId);
        if (collection.items.keys().includes(key)) {
            collection.patchItems({
                deleted: [key]
            });
        }
    }

    createOrRetrieveSettingsCollection(): CollectionProxy {
        const source = this.createOrRetrievePageMapSource();
        for (const [, collection] of source.collections) {
            if (collection.getName() === 'settings') {
                return collection;
            }
        }
        return source.addCollection('settings', SETTINGS_SCHEMA);
    }

    getLayoutSettings(collection: CollectionProxy, pageId: string): LayoutSettings {
        const key = addQuotationMarks(pageId);
        let layoutSettings: LayoutSettings = defaultLayoutSettings;
        if (collection.items.keys().includes(key)) {
            layoutSettings = JSON.parse(
                collection.items.get(key).fields.get('layout_settings')?.toString() ?? ''
            ) as LayoutSettings;
        }
        return layoutSettings;
    }

    getDrawSettings(collection: CollectionProxy, pageId: string): DrawSettings {
        const key = addQuotationMarks(pageId);
        let drawSettings: DrawSettings = defaultDrawSettings;
        if (collection.items.keys().includes(key)) {
            drawSettings = JSON.parse(
                collection.items.get(key).fields.get('draw_settings')?.toString() ?? ''
            ) as DrawSettings;
        }
        return drawSettings;
    }

    getImageSettings(collection: CollectionProxy, pageId: string): ImageSettings {
        const key = addQuotationMarks(pageId);
        let imageSettings: ImageSettings = defaultImageSettings;
        if (collection.items.keys().includes(key)) {
            imageSettings = JSON.parse(
                collection.items.get(key).fields.get('image_settings')?.toString() ?? ''
            ) as ImageSettings;
        }
        return imageSettings;
    }

    createOrRetrievePageMapSource(): DataSourceProxy {
        for (const [, source] of this.data.dataSources) {
            if (source.getSourceConfig().id === 'PageMap') {
                return source;
            }
        }
        return this.data.addDataSource('PageMap', { id: 'PageMap' });
    }

    createOrRetrievePageMapCollection(): CollectionProxy {
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

    updatePageMap(pageId: string, networkGuid: string): void {
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

    getDeviceCollectionForPage(pageId: string): string {
        const networkGuid = this.getNetworkForPage(pageId);
        const source = this.createOrRetrieveNetworkSource('', networkGuid);
        const collection = this.createOrRetrieveDeviceCollection(source);
        return collection.id;
    }

    getLinksCollectionForPage(pageId: string): string {
        const networkGuid = this.getNetworkForPage(pageId);
        const source = this.createOrRetrieveNetworkSource('', networkGuid);
        const collection = this.createOrRetrieveLinkCollection(source);
        return collection.id;
    }

    saveDevices(source: DataSourceProxy, devices: Device[]) {
        const collection = this.createOrRetrieveDeviceCollection(source);
        this.clearCollection(collection); // TODO: Replace once updateDevicesInCollection Function is implemented
        this.addDevicesToCollection(collection, devices);
    }

    saveLinks(networkGuid: string, links: DeviceLink[]) {
        const source = this.createOrRetrieveNetworkSource('', networkGuid);
        const collection = this.createOrRetrieveLinkCollection(source);
        this.clearCollection(collection); // TODO: Replace once updateLinksInCollection Function is implemented
        this.addLinksToCollection(collection, links);
    }

    saveDeviceFilter(source: DataSourceProxy, filter: DeviceFilter) {
        const collection = this.createOrRetrieveDeviceFilterCollection(source);
        this.clearCollection(collection);
        this.saveDeviceFilter(source, filter);
    }
}
