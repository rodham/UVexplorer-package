import { DevicesModal } from '@uvx/devices-modal';
import * as devicesModel from 'model/uvx/device';
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
    // const mockNetworkRequest = {
    //     network_guid: 'myNetwork'
    // };
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should correctly pull in uvx client mock', async () => {
        const testClient = new UVExplorerClient(mockEditorClient);
        await expect(testClient.listDevices({} as devicesModel.DeviceListRequest)).resolves.toEqual(mockDeviceList);
    });

    describe('SendNetworks tests', () => {
        const modal = new DevicesModal(
            mockEditorClient,
            mockDocClient,
            mockUvxClient,
            mockDataClient
        );
        jest.spyOn(modal, 'loadPageNetwork').mockResolvedValue();
        const listNetworksSpy = jest.spyOn(mockUvxClient, 'listNetworks').mockResolvedValue(mockNetworkSummariesResponse.network_summaries);
        const getPageIdSpy = jest.spyOn(mockDocClient, 'getPageId').mockReturnValue('0_0');
        const sendMessageMock = jest.spyOn(modal, 'sendMessage');

        const networkLoadedSpy = jest.spyOn(mockDataClient, 'checkIfNetworkLoaded').mockReturnValue(true);
        const getNetworkSpy = jest.spyOn(mockDataClient, 'getNetworkForPage').mockReturnValue('00000000-0000-0000-0000-000000000000');
        const mockSource = new lucid.DataSourceProxy('source', mockEditorClient);
        const loadNetworkSpy = jest.spyOn(modal, 'loadNetwork').mockResolvedValue(mockSource);
        const sendDevicesSpy = jest.spyOn(modal, 'sendDevices').mockResolvedValue();

        it('Should make listNetworks request and send message to child', async () => {
            await modal.sendNetworks(true);

            expect(listNetworksSpy).toHaveBeenCalledTimes(1);
            expect(getPageIdSpy).toHaveBeenCalledTimes(1);
            expect(sendMessageMock).toHaveBeenCalledWith({
                action: 'listNetworks',
                network_summaries: mockNetworkSummariesResponse.network_summaries
            });
        });

        it('Should make listNetworks request and call sendDevices', async () => {
            await modal.sendNetworks(false);

            expect(listNetworksSpy).toHaveBeenCalledTimes(1);
            expect(getPageIdSpy).toHaveBeenCalledTimes(1);
            expect(networkLoadedSpy).toHaveBeenCalledWith('0_0');
            expect(getNetworkSpy).toHaveBeenCalledWith('0_0');
            expect(loadNetworkSpy).toHaveBeenCalledWith('My Network', '00000000-0000-0000-0000-000000000000');
            expect(sendDevicesSpy).toHaveBeenCalledWith(mockSource, 'My Network');
        });
    });
});
