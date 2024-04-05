import { Device, DeviceLink } from 'model/uvx/device';
import { CollectionProxy, DataProxy, DataSourceProxy, EditorClient } from 'lucid-extension-sdk';
import { createDataProxy } from '@data/data-utils';

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

    createOrRetrieveNetworkSource(_name: string, _guid: string): DataSourceProxy {
        return new DataSourceProxy('', new EditorClient());
    }

    createOrRetrieveDeviceCollection(_source: DataSourceProxy): CollectionProxy {
        return new CollectionProxy('', new EditorClient());
    }

    createOrRetrieveLinkCollection(_source: DataSourceProxy): CollectionProxy {
        return new CollectionProxy('', new EditorClient());
    }

    addDevicesToCollection(_collection: CollectionProxy, _devices: Device[]): void {
        return;
    }

    clearCollection(_collection: CollectionProxy): void {
        return;
    }

    addLinksToCollection(_collection: CollectionProxy, _links: DeviceLink[]): void {
        return;
    }

    createOrRetrievePageMapSource(): DataSourceProxy {
        return new DataSourceProxy('', new EditorClient());
    }

    createOrRetrievePageMapCollection(): CollectionProxy {
        return new CollectionProxy('', new EditorClient());
    }

    updatePageMap(_pageId: string, _networkGuid: string): void {
        return;
    }

    getNetworkForPage(_pageId: string): string {
        return 'My Network';
    }

    getDeviceCollectionForPage(_pageId: string): string {
        return 'my_network_device';
    }

    getDisplayEdgeCollectionForPage(_pageId: string): string {
        return 'my_network_display_edge';
    }

    createOrRetrieveSettingsCollection(): CollectionProxy {
        return new CollectionProxy('', new EditorClient());
    }

    saveDevices(source: DataSourceProxy, devices: Device[]) {
        return;
    }
}
