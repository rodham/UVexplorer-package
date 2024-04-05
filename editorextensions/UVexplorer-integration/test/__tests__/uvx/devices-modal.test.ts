import { DevicesModal } from '@uvx/devices-modal';
import * as devicesModel from 'model/uvx/device';
import * as networkModel from 'model/uvx/network';
import * as lucid from 'lucid-extension-sdk';
import { UVExplorerClient } from '@uvx/uvx-client';
import { mockDeviceList } from 'mock_data/devices';
import { DataClient } from '@data/data-client';
import { DocumentClient } from 'src/doc/document-client';
import { mockNetworkSummariesResponse } from '../helpers';

jest.mock('lucid-extension-sdk');
jest.mock('@data/data-client');
jest.mock('model/uvx/network');
jest.mock('model/uvx/device');
jest.mock('@uvx/uvx-client');

describe('Devices Modal Tests', () => {
    const mockEditorClient = new lucid.EditorClient();
    const mockViewport = {
        getCurrentPage: () => {
            return { id: '0_0' };
        }
    } as lucid.Viewport;
    const mockDataClient = DataClient.getInstance(mockEditorClient);

    const mockDocClient = new DocumentClient(mockViewport, mockDataClient);
    const mockUvxClient = new UVExplorerClient(mockEditorClient);
    const mockNetworkRequest = {
        network_guid: 'myNetwork'
    };
    const mockDeviceListRequest = {};

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should correctly pull in uvx client mock', async () => {
        const testClient = new UVExplorerClient(mockEditorClient);
        await expect(testClient.listDevices({} as devicesModel.DeviceListRequest)).resolves.toEqual(mockDeviceList);
    });

    const modal = new DevicesModal(mockEditorClient, mockDocClient, mockUvxClient, mockDataClient);

    describe('SendNetworks tests', () => {
        it('Should make listNetworks request and send message to child', async () => {
            jest.spyOn(modal, 'loadPageNetwork').mockResolvedValue();
            const listNetworksSpy = jest
                .spyOn(mockUvxClient, 'listNetworks')
                .mockResolvedValue(mockNetworkSummariesResponse.network_summaries);
            const getPageIdSpy = jest.spyOn(mockDocClient, 'getPageId').mockReturnValue('0_0');
            const sendMessageMock = jest.spyOn(modal, 'sendMessage');

            await modal.sendNetworks(true);

            expect(listNetworksSpy).toHaveBeenCalledTimes(1);
            expect(getPageIdSpy).toHaveBeenCalledTimes(1);
            expect(sendMessageMock).toHaveBeenCalledWith({
                action: 'listNetworks',
                network_summaries: JSON.stringify(mockNetworkSummariesResponse.network_summaries)
            });
        });

        it('Should make listNetworks request and call sendDevices', async () => {
            jest.spyOn(modal, 'loadPageNetwork').mockResolvedValue();
            const listNetworksSpy = jest
                .spyOn(mockUvxClient, 'listNetworks')
                .mockResolvedValue(mockNetworkSummariesResponse.network_summaries);
            const getPageIdSpy = jest.spyOn(mockDocClient, 'getPageId').mockReturnValue('0_0');

            const getNetworkSpy = jest
                .spyOn(mockDataClient, 'getNetworkForPage')
                .mockReturnValue('00000000-0000-0000-0000-000000000000');
            const mockSource = new lucid.DataSourceProxy('source', mockEditorClient);
            const loadNetworkSpy = jest.spyOn(modal, 'loadNetwork').mockResolvedValue(mockSource);
            const sendDevicesSpy = jest.spyOn(modal, 'sendDevices').mockResolvedValue(undefined);

            await modal.sendNetworks(false);

            expect(listNetworksSpy).toHaveBeenCalledTimes(1);
            expect(getPageIdSpy).toHaveBeenCalledTimes(1);
            expect(getNetworkSpy).toHaveBeenCalledWith('0_0');
            expect(loadNetworkSpy).toHaveBeenCalledWith('My Network', '00000000-0000-0000-0000-000000000000');
            expect(sendDevicesSpy).toHaveBeenCalledWith(mockSource, 'My Network');
        });

        it('Should print error to console when source is undefined', async () => {
            jest.spyOn(modal, 'loadPageNetwork').mockResolvedValue();
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            jest.spyOn(modal, 'loadNetwork').mockResolvedValue(undefined);

            await modal.sendNetworks(false);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('loadNetwork tests', () => {
        it('Should make get and return network source', async () => {
            const networkRequestSpy = jest.spyOn(networkModel, 'NetworkRequest').mockReturnValue(mockNetworkRequest);
            const uvxLoadNetworkSpy = jest.spyOn(mockUvxClient, 'loadNetwork').mockResolvedValue();
            const mockSource = new lucid.DataSourceProxy('source', mockEditorClient);
            const getNetworkSourceSpy = jest.spyOn(mockDocClient, 'getNetworkSource').mockReturnValue(mockSource);

            const actualSource = await modal.loadNetwork('myNetwork', 'myNetwork');

            expect(networkRequestSpy).toHaveBeenCalledWith('myNetwork');
            expect(uvxLoadNetworkSpy).toHaveBeenCalledWith(mockNetworkRequest);
            expect(getNetworkSourceSpy).toHaveBeenCalledWith('myNetwork', 'myNetwork');
            expect(actualSource).toBe(mockSource);
        });

        it('Should throw error when unable to retrieve network source', async () => {
            const getNetworkSourceSpy = jest.spyOn(mockDocClient, 'getNetworkSource').mockImplementation(() => {
                throw new Error();
            });

            const actualSource = await modal.loadNetwork('myNetwork', 'myNetwork');

            expect(getNetworkSourceSpy).toThrow(Error);
            expect(actualSource).toBeUndefined();
        });
    });

    describe('sendDevices tests', () => {
        const mockSource = new lucid.DataSourceProxy('source', mockEditorClient);
        it('Should call sendDevices with listDevices action', async () => {
            const deviceListRequestSpy = jest
                .spyOn(devicesModel, 'DeviceListRequest')
                .mockReturnValue(mockDeviceListRequest);
            const listDevicesSpy = jest.spyOn(mockUvxClient, 'listDevices').mockResolvedValue(mockDeviceList);
            const saveDevicesSpy = jest.spyOn(mockDataClient, 'saveDevices');
            const getDeviceGuidsSpy = jest.spyOn(mockDocClient, 'getNetworkDeviceBlockGuids');
            const sendMessageSpy = jest.spyOn(modal, 'sendMessage').mockResolvedValue();
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await modal.sendDevices(mockSource, 'My Network');

            expect(deviceListRequestSpy).toHaveBeenCalled();
            expect(listDevicesSpy).toHaveBeenCalledWith(mockDeviceListRequest);
            expect(saveDevicesSpy).toHaveBeenCalledWith(mockSource, mockDeviceList);
            expect(getDeviceGuidsSpy).toHaveBeenCalled();
            expect(consoleSpy).not.toHaveBeenCalled();
            expect(sendMessageSpy).toHaveBeenCalledWith({
                action: 'listDevices',
                devices: JSON.stringify(mockDeviceList),
                visibleConnectedDeviceGuids: JSON.stringify([]),
                networkName: 'My Network',
                backButton: true
            });
        });

        it('Should throw error when unable to list devices', async () => {
            const listDevicesSpy = jest.spyOn(mockUvxClient, 'listDevices').mockImplementation(() => {
                throw new Error();
            });
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await modal.sendDevices(mockSource, 'My Network');

            expect(listDevicesSpy).toThrow(Error);
            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
