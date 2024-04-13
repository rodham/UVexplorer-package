import { Device, DeviceFilter } from 'model/uvx/device';
import {
    CollectionProxy,
    DataProxy,
    DataSourceProxy,
    EditorClient,
    ScalarFieldTypeEnum,
    SchemaDefinition,
    SerializedFieldType
} from 'lucid-extension-sdk';
import { addQuotationMarks, createDataProxy, deviceToRecord, displayEdgeToRecord, toSnakeCase } from '@data/data-utils';
import {
    defaultDrawSettings,
    defaultImageSettings,
    defaultLayoutSettings,
    DrawSettings,
    ImageSettings,
    LayoutSettings
} from 'model/uvx/topo-map';
import { DisplayEdgeSet } from 'model/uvx/display-edge-set';

export const DEVICE_REFERENCE_KEY = 'device_reference_key';
export const DISPLAY_EDGE_REFERENCE_KEY = 'display_edge_reference_key';

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

export const DISPLAY_EDGE_SCHEMA: SchemaDefinition = {
    fields: [
        { name: 'local_node_id', type: ScalarFieldTypeEnum.NUMBER },
        { name: 'remote_node_id', type: ScalarFieldTypeEnum.NUMBER },
        { name: 'device_links', type: ScalarFieldTypeEnum.STRING }
    ],
    primaryKey: ['local_node_id', 'remote_node_id']
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
        { name: 'page_id', type: ScalarFieldTypeEnum.STRING },
        { name: 'dynamic_membership', type: ScalarFieldTypeEnum.BOOLEAN },
        { name: 'device_filter', type: ScalarFieldTypeEnum.STRING }
    ],
    primaryKey: ['page_id']
};

/**
 * Class with functions to interact with Data Collections within LucidChart.
 */
export class DataClient {
    private data: DataProxy;

    constructor(client: EditorClient) {
        this.data = createDataProxy(client);
    }

    /**
     * Creates or retrieves the corresponding network source from the given network guid.
     * @param guid network guid as a string
     * @param name network name as a string (optional)
     * The network name will become the name of the data source if provided, otherwise the guid.
     * The network source name propagates to the device and display edge data collections, making them more human-readable when looking in the data.
     */
    createOrRetrieveNetworkSource(guid: string, name?: string): DataSourceProxy {
        for (const [, source] of this.data.dataSources) {
            if (source.getSourceConfig().guid === guid) {
                return source;
            }
        }
        return this.data.addDataSource(name ?? guid, { guid: guid });
    }

    /**
     * Creates or Retrieves the pageMap source.
     * @returns DataSourceProxy
     */
    createOrRetrievePageMapSource(): DataSourceProxy {
        for (const [, source] of this.data.dataSources) {
            if (source.getSourceConfig().id === 'PageMap') {
                return source;
            }
        }
        return this.data.addDataSource('PageMap', { id: 'PageMap' });
    }

    /**
     * Creates or retrieves pageMap collection for linking a page to a loaded network.
     * @returns CollectionProxy
     */
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

    /**
     * Creates or retrieves the corresponding Device collection from the given network source.
     * @param source DataSourceProxy
     * @returns CollectionProxy
     */
    createOrRetrieveDeviceCollection(source: DataSourceProxy): CollectionProxy {
        for (const [, collection] of source.collections) {
            if (collection.getName() === `${toSnakeCase(source.getName())}_device`) {
                return collection;
            }
        }
        return source.addCollection(`${toSnakeCase(source.getName())}_device`, DEVICE_SCHEMA);
    }

    /**
     * Creates or retrieves the corresponding DisplayEdge collection from the given network source.
     * @param source DataSourceProxy
     * @returns CollectionProxy
     */
    createOrRetrieveDisplayEdgeCollection(source: DataSourceProxy): CollectionProxy {
        for (const [, collection] of source.collections) {
            if (collection.getName() === `${toSnakeCase(source.getName())}_display_edge`) {
                return collection;
            }
        }
        return source.addCollection(`${toSnakeCase(source.getName())}_display_edge`, DISPLAY_EDGE_SCHEMA);
    }

    /**
     * Creates or retrieves the DeviceFilter collection containing data for dynamic map selection.
     * @returns CollectionProxy
     */
    createOrRetrieveDeviceFilterCollection(): CollectionProxy {
        const source = this.createOrRetrievePageMapSource();
        for (const [, collection] of source.collections) {
            if (collection.getName() === `${toSnakeCase(source.getName())}_filter`) {
                return collection;
            }
        }
        return source.addCollection(`${toSnakeCase(source.getName())}_filter`, DEVICE_FILTER_SCHEMA);
    }

    /**
     * Creates or retrieves settings collection containing map settings data.
     * @returns CollectionProxy
     */
    createOrRetrieveSettingsCollection(): CollectionProxy {
        const source = this.createOrRetrievePageMapSource();
        for (const [, collection] of source.collections) {
            if (collection.getName() === 'settings') {
                return collection;
            }
        }
        return source.addCollection('settings', SETTINGS_SCHEMA);
    }

    /**
     * Adds the given devices to the given Device collection.
     * @param collection CollectionProxy
     * @param devices list of devices (Device[])
     */
    addDevicesToCollection(collection: CollectionProxy, devices: Device[]): void {
        collection.patchItems({
            added: devices.map(deviceToRecord)
        });
    }

    /**
     * Adds given displayEdges as a list of Record<string, SerializedFieldType> to given DisplayEdge collection.
     * @param collection CollectionProxy
     * @param displayEdges DisplayEdgeSet
     */
    addDisplayEdgesToCollection(collection: CollectionProxy, displayEdges: DisplayEdgeSet): void {
        const displayEdgeRecords: Record<string, SerializedFieldType>[] = [];
        for (const displayEdge of displayEdges.map.values()) {
            displayEdgeRecords.push(displayEdgeToRecord(displayEdge));
        }
        collection.patchItems({
            added: displayEdgeRecords
        });
    }

    /**
     * Adds given settings and pageId to given settings collection.
     * @param collection CollectionProxy
     * @param pageId string
     * @param layoutSettings LayoutSettings
     * @param drawSettings DrawSettings
     * @param imageSettings ImageSettings
     */
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

    /**
     * Adds given DeviceFilter and boolean determining dynamic or static layout to given DeviceFilter collection.
     * @param collection CollectionProxy
     * @param pageId string
     * @param isDynamic boolean
     * @param filter DeviceFilter (optionally undefined)
     */
    addDeviceFilterToCollection(
        collection: CollectionProxy,
        pageId: string,
        isDynamic: boolean,
        filter?: DeviceFilter
    ) {
        collection.patchItems({
            added: [
                {
                    page_id: pageId,
                    dynamic_membership: isDynamic,
                    device_filter: JSON.stringify(filter)
                }
            ]
        });
    }

    /**
     * Removes all items in given Device, DisplayEdge, or DeviceFilter collection.
     * @param collection CollectionProxy
     */
    clearCollection(collection: CollectionProxy): void {
        const guids = collection.items.keys();
        collection.patchItems({
            deleted: guids
        });
    }

    /**
     * Removes given items from given Device collection.
     * @param collection CollectionProxy
     * @param removeDevices list of guid strings
     */
    clearPartOfCollection(collection: CollectionProxy, removeDevices: string[]): void {
        collection.patchItems({
            deleted: removeDevices
        });
    }

    /**
     * Removes corresponding settings or DeviceFilter from the given settings or DeviceFilter collection based on the given pageId.
     * @param collection CollectionProxy
     * @param pageId string
     */
    deleteSettingsFromCollection(collection: CollectionProxy, pageId: string): void {
        const key = addQuotationMarks(pageId);
        if (collection.items.keys().includes(key)) {
            collection.patchItems({
                deleted: [key]
            });
        }
    }

    /**
     * Checks if using dynamic map selection for given DeviceFilter collection and pageId.
     * @param collection CollectionProxy
     * @param pageId string
     * @returns boolean or undefined
     */
    isUsingDynamicMembership(collection: CollectionProxy, pageId: string): boolean | undefined {
        const key = addQuotationMarks(pageId);
        let usingDynamicMembership: boolean | undefined = undefined;
        if (collection.items.keys().includes(key)) {
            usingDynamicMembership = JSON.parse(
                collection.items.get(key).fields.get('dynamic_membership')?.toString() ?? ''
            ) as boolean;
        }
        return usingDynamicMembership;
    }

    /**
     * Retrieves corresponding DeviceFilter from given DeviceFilter collection based on given pageId.
     * @param collection CollectionProxy
     * @param pageId string
     * @returns DeviceFilter or undefined
     */
    getDeviceFilter(collection: CollectionProxy, pageId: string): DeviceFilter | undefined {
        const key = addQuotationMarks(pageId);
        let deviceFilter: DeviceFilter | undefined = undefined;
        if (collection.items.keys().includes(key)) {
            deviceFilter = JSON.parse(
                collection.items.get(key).fields.get('device_filter')?.toString() ?? ''
            ) as DeviceFilter;
        }
        return deviceFilter;
    }

    /**
     * Retrieves corresponding LayoutSettings from given settings collection based on given pageId.
     * @param collection CollectionProxy
     * @param pageId string
     * @returns LayoutSettings
     */
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

    /**
     * Retrieves corresponding DrawSettings from given settings collection based on given pageId.
     * @param collection CollectionProxy
     * @param pageId string
     * @returns DrawSettings
     */
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

    /**
     * Retrieves corresponding ImageSettings from given settings collection based on given pageId.
     * @param collection CollectionProxy
     * @param pageId string
     * @returns ImageSettings
     */
    getImageSettings(collection: CollectionProxy, pageId: string): ImageSettings {
        const key = addQuotationMarks(pageId);
        let imageSettings: ImageSettings = defaultImageSettings;
        if (collection.items.keys().includes(key)) {
            imageSettings = JSON.parse(
                collection.items.get(key).fields.get('image_settings')?.toString() ?? '{}'
            ) as ImageSettings;
        }
        return imageSettings;
    }

    /**
     * Updates the loaded network guid with given networkGuid for a page in pageMap collection based on given pageId.
     * @param pageId string
     * @param networkGuid string
     * @returns void
     */
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

    /**
     * Retrieves corresponding network guid from a given pageId.
     * @param pageId string
     * @returns networkGuid as a string
     */
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
        console.error('Could not retrieve the network associated with the current page.');
        return '';
    }

    /**
     * Retrieves corresponding Device collection id based on given pageId.
     * @param pageId string
     * @returns collection id as a string
     */
    getDeviceCollectionForPage(pageId: string): string {
        const networkGuid = this.getNetworkForPage(pageId);
        const source = this.createOrRetrieveNetworkSource(networkGuid);
        const collection = this.createOrRetrieveDeviceCollection(source);
        return collection.id;
    }

    /**
     * Retrieves corresponding DisplayEdge collection id based on given pageId.
     * @param pageId string
     * @returns collection id as a string
     */
    getDisplayEdgeCollectionForPage(pageId: string): string {
        const networkGuid = this.getNetworkForPage(pageId);
        const source = this.createOrRetrieveNetworkSource(networkGuid);
        const collection = this.createOrRetrieveDisplayEdgeCollection(source);
        return collection.id;
    }

    /**
     * Clears, then adds given devices to the Device collection.
     * @param source DataSourceProxy
     * @param devices list of devices (Device[])
     */
    saveDevices(source: DataSourceProxy, devices: Device[]) {
        const collection = this.createOrRetrieveDeviceCollection(source);
        this.clearCollection(collection);
        this.addDevicesToCollection(collection, devices);
    }

    /**
     * Clears, then adds given displayEdges to DisplayEdge collection.
     * @param networkGuid string
     * @param displayEdges DisplayEdgeSet
     */
    saveDisplayEdges(networkGuid: string, displayEdges: DisplayEdgeSet) {
        const source = this.createOrRetrieveNetworkSource(networkGuid);
        const collection = this.createOrRetrieveDisplayEdgeCollection(source);
        this.clearCollection(collection);
        this.addDisplayEdgesToCollection(collection, displayEdges);
    }

    /**
     * Checks if a network is loaded on the current page.
     * @param pageId string
     * @returns boolean
     */
    checkIfNetworkLoaded(pageId: string): boolean {
        const collection = this.createOrRetrievePageMapCollection();
        for (const [, item] of collection.items) {
            if (item.fields.get('page_id') === pageId) {
                const networkGuid: SerializedFieldType = item.fields.get('network_guid');
                if (typeof networkGuid === 'string') {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Clears, then adds DeviceFilter to the DeviceFilter collection.
     * @param source DataSourceProxy
     * @param filter DeviceFilter
     */
    saveDeviceFilter(source: DataSourceProxy, filter: DeviceFilter) {
        const collection = this.createOrRetrieveDeviceFilterCollection();
        this.clearCollection(collection);
        this.saveDeviceFilter(source, filter);
    }
}
