import {
    CollectionProxy, DataItemProxy,
    DataProxy,
    DataSourceProxy,
    EditorClient, JsonSerializable, SchemaDefinition, SerializedFieldType
} from "lucid-extension-sdk";
import {Data, DEVICE_SCHEMA} from "src/data/data";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('lucid-extension-sdk', () => ({
    ...jest.requireActual('lucid-extension-sdk'),
    EditorClient: jest.fn().mockImplementation(() => ({
        sendCommand: jest.fn(),
    })),
    DataProxy: jest.fn().mockImplementation(() => {
        const dataSources = new Map<string, DataSourceProxy>();

        return {
            get dataSources() {
                return dataSources;
            },
            addDataSource: jest.fn((id: string, config: Record<string, JsonSerializable>) : DataSourceProxy => {
                const dataSource = new DataSourceProxy(id , new EditorClient());
                jest.spyOn(dataSource, 'getSourceConfig').mockReturnValue(config);
                dataSources.set(id, dataSource);
                return dataSource;
            }),
        };
    }),
    DataSourceProxy: jest.fn().mockImplementation((name: string) => {
        const collections = new Map<string, CollectionProxy>();

        return {
            name,
            get collections() {
                return collections;
            },
            getName: jest.fn(() => name),
            getSourceConfig: jest.fn(() => ({})),
            addCollection: jest.fn((name: string, schema: SchemaDefinition) => {
                const collectionProxy = new CollectionProxy(name, new EditorClient());
                jest.spyOn(collectionProxy, 'getSchema').mockReturnValue(schema);
                collections.set(name, collectionProxy)
                return collectionProxy;
            })
        };
    }),
    CollectionProxy: jest.fn().mockImplementation((name: string) => ({
        name,
        getName: jest.fn(() => name),
        getSyncCollectionId: jest.fn(),
        getBranchedFrom: jest.fn(),
        getLocalChanges: jest.fn(),
        items: new Map<string, DataItemProxy>(),
        patchItems: jest.fn(),
        getFields: jest.fn(),
        getSchema: jest.fn(),
    })),
    DataItemProxy: jest.fn().mockImplementation((primaryKey: string, collection: CollectionProxy, client: EditorClient) => ({
        primaryKey,
        collection,
        client,
        fields: new Map<string, SerializedFieldType>(),
        exists: jest.fn(),
    })),
}));

describe('Data Tests', () => {
    let mockEditorClient : EditorClient;
    let mockDataProxy: DataProxy;
    let data : Data;

    beforeAll(() => {
        mockEditorClient = new EditorClient();
        mockDataProxy = new DataProxy(mockEditorClient);
        data = Data.getInstance(mockEditorClient, mockDataProxy);
    });

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    describe('createOrRetrieveNetworkSource tests', () => {
        it('Should return the data source when it exists', () => {
            const mockDataSource = mockDataProxy.addDataSource('My Network', { guid: 'guid' });
            const getSourceConfigSpy = jest.spyOn(mockDataSource, 'getSourceConfig').mockReturnValue({ guid: 'guid'});
            const addDataSourceSpy = jest.spyOn(mockDataProxy, 'addDataSource').mockClear();

            expect(mockDataProxy.dataSources.size).toBe(1);
            const source = data.createOrRetrieveNetworkSource('My Network', 'guid');
            expect(source.id).toBe('My Network');
            expect(getSourceConfigSpy).toHaveBeenCalledTimes(1);
            expect(addDataSourceSpy).toHaveBeenCalledTimes(0);
            expect(mockDataProxy.dataSources.size).toBe(1);
        });

        it('Should return a new data source when it does not yet exist', () => {
            const addDataSourceSpy = jest.spyOn(mockDataProxy, 'addDataSource');

            expect(mockDataProxy.dataSources.size).toBe(0);
            const source = data.createOrRetrieveNetworkSource('My Network', 'guid-does-not-exist');
            expect(source.id).toBe('guid-does-not-exist');
            expect(addDataSourceSpy).toHaveBeenCalledTimes(1);
            expect(mockDataProxy.dataSources.size).toBe(1);
        });
    });

    describe('createOrRetrieveDeviceCollection tests', () => {
        it('Should return the device collection when it exists', () => {
            const mockDataSource = mockDataProxy.addDataSource('My Network', { guid: 'guid' });
            const mockCollection = mockDataSource.addCollection('my_network_device', DEVICE_SCHEMA);

            const collectionGetNameSpy = jest.spyOn(mockCollection, 'getName');
            const sourceGetNameSpy = jest.spyOn(mockDataSource, 'getName');
            const toSnakeCaseSpy = jest.spyOn(data,'toSnakeCase');

            expect(mockDataSource.collections.size).toBe(1);
            const collection = data.createOrRetrieveDeviceCollection(mockDataSource);
            expect(collectionGetNameSpy).toHaveBeenCalledTimes(1);
            expect(sourceGetNameSpy).toHaveBeenCalledTimes(1);
            expect(toSnakeCaseSpy).toHaveBeenCalledTimes(1);
            expect(mockDataSource.collections.size).toBe(1);
            expect(collection.getName()).toBe('my_network_device');
            expect(collection.getSchema()).toBe(DEVICE_SCHEMA);
        });

        it('Should return a new device collection when it does not yet exist', () => {
            const mockDataSource = mockDataProxy.addDataSource('My Network', { guid: 'guid' });

            const sourceGetNameSpy = jest.spyOn(mockDataSource, 'getName');
            const addCollectionSpy = jest.spyOn(mockDataSource,'addCollection');
            const toSnakeCaseSpy = jest.spyOn(data,'toSnakeCase');

            expect(mockDataSource.collections.size).toBe(0);
            const collection = data.createOrRetrieveDeviceCollection(mockDataSource);
            expect(addCollectionSpy).toHaveBeenCalledTimes(1)
            expect(sourceGetNameSpy).toHaveBeenCalledTimes(1);
            expect(toSnakeCaseSpy).toHaveBeenCalledTimes(1);
            expect(mockDataSource.collections.size).toBe(1);
            expect(collection.getName()).toBe('my_network_device');
            expect(collection.getSchema()).toBe(DEVICE_SCHEMA);
        });
    });
});
