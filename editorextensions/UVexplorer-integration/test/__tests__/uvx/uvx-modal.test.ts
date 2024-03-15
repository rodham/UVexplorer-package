import { CollectionProxy, EditorClient, PageProxy, Viewport } from 'lucid-extension-sdk';
import { UVXModal } from '@uvx/uvx-modal';
import { UVExplorerClient } from '@uvx/uvx-client';
import { NetworkRequest } from 'model/uvx/network';
import * as TopoMap from 'model/uvx/topo-map';
import { mockTopoMap } from '../helpers';
import { DataClient } from '@data/data-client';
import { DocumentClient } from '@doc/document-client';
import { defaultDrawSettings, defaultLayoutSettings } from 'model/uvx/topo-map';

jest.mock('lucid-extension-sdk', (): unknown => ({
    ...jest.requireActual('lucid-extension-sdk'),
    EditorClient: jest.fn().mockImplementation(() => ({
        sendCommand: jest.fn(),
        getPackageSettings: jest.fn(),
        alert: jest.fn(),
        showPackageSettingsModal: jest.fn(),
        canEditPackageSettings: jest.fn()
    }))
}));

jest.mock('@uvx/uvx-client');
jest.mock('@data/data-client');
jest.mock('model/uvx/topo-map');
jest.mock('@draw/draw-topo-map');
jest.mock('@blocks/block-utils');

describe('UVXModal', () => {
    let mockClient: EditorClient;
    let mockViewport: Viewport;
    let mockPage: PageProxy;
    let mockUvxClient: UVExplorerClient;
    let mockDataClient: DataClient;
    let mockDocClient: DocumentClient;
    class MockModal extends UVXModal {
        constructor(
            client: EditorClient,
            docClient: DocumentClient,
            uvxClient: UVExplorerClient,
            dataClient: DataClient
        ) {
            super(client, docClient, uvxClient, dataClient, 'path');
        }
    }
    let mockModal: MockModal;

    beforeEach(() => {
        mockClient = new EditorClient();
        mockViewport = new Viewport(mockClient);
        mockDataClient = DataClient.getInstance(mockClient);
        mockDocClient = new DocumentClient(mockViewport, mockDataClient);
        mockPage = { id: 1 } as unknown as PageProxy;
        mockUvxClient = new UVExplorerClient(mockClient);
        mockModal = new MockModal(mockClient, mockDocClient, mockUvxClient, mockDataClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('closeSession', () => {
        it('should close the session successfully', async () => {
            const closeSessionSpy = jest.spyOn(mockUvxClient, 'closeSession').mockResolvedValue();
            const logSpy = jest.spyOn(console, 'log');

            await mockModal.closeSession();
            expect(closeSessionSpy).toHaveBeenCalled();
            expect(logSpy).toHaveBeenCalledWith('Successfully closed the session.');
        });

        it('should handle errors while closing the session', async () => {
            const mockError = new Error('failed to close session');
            const closeSessionSpy = jest.spyOn(mockUvxClient, 'closeSession').mockRejectedValue(mockError);
            const errorSpy = jest.spyOn(console, 'error');

            await mockModal.closeSession();
            expect(closeSessionSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalledWith(mockError);
        });
    });

    describe('loadPageNetwork', () => {
        it('should load the network for the current page successfully', async () => {
            const getCurrentPageSpy = jest.spyOn(mockViewport, 'getCurrentPage').mockReturnValueOnce(mockPage);
            const loadNetworkSpy = jest.spyOn(mockUvxClient, 'loadNetwork').mockResolvedValue();

            await mockModal.loadPageNetwork();

            expect(getCurrentPageSpy).toHaveBeenCalled();
            expect(loadNetworkSpy).toHaveBeenCalledWith(new NetworkRequest('My Network'));
        });

        it('should throw an error if no networkGuid is found for the page', async () => {
            const getCurrentPageSpy = jest.spyOn(mockDocClient, 'getPageNetworkGuid').mockReturnValue(undefined);
            const errorSpy = jest.spyOn(console, 'error');

            await mockModal.loadPageNetwork();
            expect(errorSpy).toHaveBeenCalledWith('Unable to get networkGuid');
            expect(getCurrentPageSpy).toHaveBeenCalled();
        });
    });

    describe('loadTopoMap', () => {
        it('should load the topo map successfully', async () => {
            const createTopoMapRequestSpy = jest.spyOn(TopoMap, 'createTopoMapRequest');
            const getTopoMapSpy = jest.spyOn(mockUvxClient, 'getTopoMap').mockResolvedValue(mockTopoMap);

            const mockGuids = ['deviceGuid1', 'deviceGuid2'];
            const result = await mockModal.loadTopoMap(mockGuids);

            expect(createTopoMapRequestSpy).toHaveBeenCalledWith(mockGuids, defaultLayoutSettings, defaultDrawSettings);
            expect(getTopoMapSpy).toHaveBeenCalled();
            expect(result).toBe(mockTopoMap);
        });
    });

    describe('sendMapSettings', () => {
        it('should get and send settings successfully', async () => {
            const mockCollection = new CollectionProxy('settings', mockClient);
            const settingsCollectionSpy = jest
                .spyOn(mockDataClient, 'createOrRetrieveSettingsCollection')
                .mockReturnValue(mockCollection);
            const sendMessageSpy = jest.spyOn(mockModal, 'sendMessage').mockResolvedValue();

            await mockModal.sendMapSettings();

            expect(settingsCollectionSpy).toHaveBeenCalledTimes(1);
            expect(sendMessageSpy).toHaveBeenCalledWith({
                action: 'mapSettings',
                drawSettings: JSON.stringify(defaultDrawSettings),
                layoutSettings: JSON.stringify(defaultLayoutSettings)
            });
        });

        it('should handle errors while sending map settings', async () => {
            const mockError = new Error('failed to send settings');
            const sendMessageSpy = jest.spyOn(mockModal, 'sendMessage').mockRejectedValue(mockError);
            const errorSpy = jest.spyOn(console, 'error');

            await mockModal.sendMapSettings();
            expect(sendMessageSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalledWith(mockError);
        });
    });

    describe('reloadDevices', () => {
        it('should reload devices successfully', async () => {
            const sendMessageSpy = jest.spyOn(mockModal, 'sendMessage').mockResolvedValue();

            await mockModal.reloadDevices();
            expect(sendMessageSpy).toHaveBeenCalledWith({ action: 'relistDevices' });
        });

        it('should handle errors while reloading devices', async () => {
            const mockError = new Error('failed to send settings');
            const sendMessageSpy = jest.spyOn(mockModal, 'sendMessage').mockRejectedValue(mockError);
            const errorSpy = jest.spyOn(console, 'error');

            await mockModal.reloadDevices();
            expect(sendMessageSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalledWith(mockError);
        });
    });
});
