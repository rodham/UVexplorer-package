import { EditorClient, JsonSerializable, PageProxy, Viewport } from 'lucid-extension-sdk';
import { UVXModal } from '@uvx/uvx-modal';
import { UVExplorerClient } from '@uvx/uvx-client';
import { NetworkRequest } from 'model/uvx/network';
import * as TopoMap from 'model/uvx/topo-map';
import { mockTopoMap } from '../helpers';
import { DrawTopoMap } from '@draw/draw-topo-map';
import { BlockUtils } from '@blocks/block-utils';

// Mocks
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
jest.mock('@data/data');
jest.mock('model/uvx/topo-map')
jest.mock('@draw/draw-topo-map');
jest.mock('@blocks/block-utils');

describe('UVXModal', () => {
    let mockClient: EditorClient;
    let mockViewport: Viewport;
    let mockPage: PageProxy;
    let mockUvxClient: UVExplorerClient;
    class MockModal extends UVXModal {}
    let mockModal: MockModal;

    beforeEach(() => {
        mockClient = new EditorClient();
        mockViewport = new Viewport(mockClient);
        mockPage = { id: 1 } as unknown as PageProxy;
        mockUvxClient = new UVExplorerClient(mockClient);
        mockModal = new MockModal(mockClient, mockViewport, mockUvxClient, 'path');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('configureSetting', () => {
        it('should do nothing if setting is already configured', async () => {
            const getPackageSettingsSpy = jest.spyOn(mockClient, 'getPackageSettings')
            const mockPackageSettings = new Map<string, JsonSerializable>();
            mockPackageSettings.set('apiKey', 'key');
            getPackageSettingsSpy.mockResolvedValue(mockPackageSettings)
            const alertSpy = jest.spyOn(mockClient, 'alert');
            const showPackageSettingsModalSpy = jest.spyOn(mockClient, 'showPackageSettingsModal');

            await mockModal.configureSetting('apiKey');

            expect(getPackageSettingsSpy).toHaveBeenCalled();
            expect(alertSpy).not.toHaveBeenCalled();
            expect(showPackageSettingsModalSpy).not.toHaveBeenCalled();
        });

        it('should prompt user to configure setting and handle user input', async () => {
            const getPackageSettingsSpy = jest.spyOn(mockClient, 'getPackageSettings')
            const alertSpy = jest.spyOn(mockClient, 'alert');
            const canEditPackageSettingsSpy = jest.spyOn(mockClient, 'canEditPackageSettings')
            const showPackageSettingsModalSpy = jest.spyOn(mockClient, 'showPackageSettingsModal');
            const mockPackageSettings = new Map<string, JsonSerializable>();

            getPackageSettingsSpy.mockResolvedValue(mockPackageSettings);
            canEditPackageSettingsSpy.mockResolvedValue(true);
            await mockModal.configureSetting('apiKey');

            expect(alertSpy).toHaveBeenCalled();
            expect(showPackageSettingsModalSpy).toHaveBeenCalled();
        });

        it('should handle case when user cannot edit package settings', async () => {
            const getPackageSettingsSpy = jest.spyOn(mockClient, 'getPackageSettings')
            const mockPackageSettings = new Map<string, JsonSerializable>();
            getPackageSettingsSpy.mockResolvedValue(mockPackageSettings);
            const canEditPackageSettingsSpy = jest.spyOn(mockClient, 'canEditPackageSettings')
            canEditPackageSettingsSpy.mockResolvedValue(false);
            const alertSpy = jest.spyOn(mockClient, 'alert');
            const showPackageSettingsModalSpy = jest.spyOn(mockClient, 'showPackageSettingsModal');

            await mockModal.configureSetting('apiKey');

            expect(alertSpy).toHaveBeenCalled();
            expect(showPackageSettingsModalSpy).not.toHaveBeenCalled();
        });
    });

    describe('loadSettings', () => {
        it('should load settings from client', async () => {
            const getPackageSettingsSpy = jest.spyOn(mockClient, 'getPackageSettings')
            const mockPackageSettings = new Map<string, JsonSerializable>();
            mockPackageSettings.set('apiKey', 'key');
            mockPackageSettings.set('serverUrl', 'http://example.com');
            getPackageSettingsSpy.mockResolvedValue(mockPackageSettings);
            const getSpy = jest.spyOn(mockPackageSettings, 'get');

            await mockModal.loadSettings();
            expect(getSpy).toHaveBeenCalledWith('apiKey');
            expect(getSpy).toHaveBeenCalledWith('serverUrl')
        });
    });

    describe('openSession', () => {
        it('should open a session successfully', async () => {
            const mockSessionGuid = 'mock-session-guid';
            const openSessionSpy = jest.spyOn(mockUvxClient, 'openSession').mockResolvedValue(mockSessionGuid);
            const logSpy = jest.spyOn(console, 'log');

            await mockModal.openSession();
            expect(openSessionSpy).toHaveBeenCalled();
            expect(logSpy).toHaveBeenCalledWith(`Successfully opened a session: ${mockSessionGuid}`);
        });

        it('should handle errors while opening a session', async () => {
            const mockError = new Error('failed to open session')
            const openSessionSpy = jest.spyOn(mockUvxClient, 'openSession').mockRejectedValue(mockError);
            const errorSpy = jest.spyOn(console, 'error');

            await mockModal.openSession();
            expect(openSessionSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalledWith(mockError);
        });
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
            const mockError = new Error('failed to close session')
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
            expect(loadNetworkSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
                new NetworkRequest('My Network')
            );
        });

        it('should throw an error if no page id is found', async () => {
            const getCurrentPageSpy = jest.spyOn(mockViewport, 'getCurrentPage').mockReturnValue(undefined);
            const mockError = new Error('No page id found');
            const loadNetworkSpy = jest.spyOn(mockUvxClient, 'loadNetwork').mockRejectedValue(mockError);

            await expect(mockModal.loadPageNetwork()).rejects.toThrow(mockError);
            expect(getCurrentPageSpy).toHaveBeenCalled();
            expect(loadNetworkSpy).not.toHaveBeenCalled();
        });
    });

    describe('loadTopoMap', () => {
        it('should load the topo map successfully', async () => {
            const createTopoMapRequestSpy = jest.spyOn(TopoMap, 'createTopoMapRequest');
            const getTopoMapSpy = jest.spyOn(mockUvxClient, 'getTopoMap').mockResolvedValue(mockTopoMap);

            const mockGuids = ['deviceGuid1', 'deviceGuid2'];
            const result = await mockModal.loadTopoMap(mockGuids);

            expect(createTopoMapRequestSpy).toHaveBeenCalledWith(mockGuids);
            expect(getTopoMapSpy).toHaveBeenCalled()
            expect(result).toBe(mockTopoMap);
        });
    });

    describe('drawMap', () => {
        it('should draw the map successfully with valid topo map data', async () => {
            const getCurrentPageSpy = jest.spyOn(mockViewport, 'getCurrentPage').mockReturnValue(mockPage);
            const clearMapSpy = jest.spyOn(mockModal, 'clearMap').mockReturnValue(['deviceGuid1', 'deviceGuid2']);
            const loadTopoMapSpy = jest.spyOn(mockModal, 'loadTopoMap').mockResolvedValue(mockTopoMap);
            const drawTopoMapSpy = jest.spyOn(DrawTopoMap, 'drawTopoMap').mockResolvedValue();

            await mockModal.drawMap(['deviceGuid1', 'deviceGuid2'], ['deviceGuidToRemove']);

            expect(getCurrentPageSpy).toHaveBeenCalled();
            expect(clearMapSpy).toHaveBeenCalled();
            expect(loadTopoMapSpy).toHaveBeenCalled();
            expect(drawTopoMapSpy).toHaveBeenCalledWith(
                mockClient,
                mockViewport,
                mockPage,
                mockTopoMap.deviceNodes,
                mockTopoMap.deviceLinks
            );
        });

        it('should log an error when unable to load topo map data', async () => {
            const getCurrentPageSpy = jest.spyOn(mockViewport, 'getCurrentPage').mockReturnValue(mockPage);
            const clearMapSpy = jest.spyOn(mockModal, 'clearMap').mockReturnValue(['deviceGuid1', 'deviceGuid2']);
            const loadTopoMapSpy = jest.spyOn(mockModal, 'loadTopoMap').mockResolvedValue(undefined);
            const errorSpy = jest.spyOn(console, 'error');
            const drawTopoMapSpy = jest.spyOn(DrawTopoMap, 'drawTopoMap');

            await mockModal.drawMap(['deviceGuid1', 'deviceGuid2'], ['deviceGuidToRemove']);

            expect(getCurrentPageSpy).toHaveBeenCalled();
            expect(clearMapSpy).toHaveBeenCalled();
            expect(loadTopoMapSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalledWith('Could not load topo map data.');
            expect(drawTopoMapSpy).not.toHaveBeenCalled();
        });
    });

    describe('clearMap', () => {
        it('should clear the map successfully with valid inputs', () => {
            const mockDeviceGuids = ['deviceGuid1', 'deviceGuid2'];
            const mockRemoveDeviceGuids = ['deviceGuidToRemove']
            const clearLinesSpy = jest.spyOn(mockModal, 'clearLines').mockImplementation();
            const clearBlocksSpy = jest.spyOn(mockModal, 'clearBlocks').mockReturnValue(mockDeviceGuids);

            const result = mockModal.clearMap(mockPage, mockDeviceGuids, mockRemoveDeviceGuids);

            expect(clearLinesSpy).toHaveBeenCalledWith(mockPage);
            expect(clearBlocksSpy).toHaveBeenCalledWith(mockPage, mockDeviceGuids, mockRemoveDeviceGuids);
            expect(result).toEqual(mockDeviceGuids);
        });
    });

    describe('clearLines', () => {
        it('should delete all device connection lines', () => {
            const mockLine = { delete: jest.fn() };
            const deleteSpy = jest.spyOn(mockLine, 'delete');
            mockPage = {allLines: new Map([['line1', mockLine], ['line2', mockLine]])} as unknown as PageProxy;
            mockModal.clearLines(mockPage);

            expect(deleteSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('clearBlocks', () => {
        it('should clear blocks and return updated device guids', () => {
            const isNetworkDeviceBlockSpy = jest.spyOn(BlockUtils, 'isNetworkDeviceBlock').mockReturnValue(true);
            const getGuidFromBlockSpy = jest.spyOn(BlockUtils, 'getGuidFromBlock').mockReturnValue('guid');
            const mockPageItem1 = { delete: jest.fn() };
            const mockPageItem2 = { delete: jest.fn() };
            mockPage = {allBlocks: new Map([['block1', mockPageItem1], ['block2', mockPageItem2]])} as unknown as PageProxy;

            const mockDevices = ['deviceGuid1', 'deviceGuid2'];
            const mockRemoveDevices = ['deviceGuidToRemove']
            const result = mockModal.clearBlocks(mockPage, mockDevices, mockRemoveDevices);

            expect(isNetworkDeviceBlockSpy).toHaveBeenCalledTimes(mockPage.allBlocks.size);
            expect(getGuidFromBlockSpy).toHaveBeenCalledTimes(mockPage.allBlocks.size);
            expect(mockPageItem1.delete).toHaveBeenCalledTimes(1);
            expect(mockPageItem2.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual([...mockDevices]);
        });
    });
});
