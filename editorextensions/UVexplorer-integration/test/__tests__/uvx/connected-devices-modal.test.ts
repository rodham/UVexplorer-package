import { ConnectedDevicesModal } from '@uvx/connected-devices-modal';
import * as model from 'model/uvx/network';
import * as devicesModel from 'model/uvx/device';
import * as lucid from 'lucid-extension-sdk';
import { UVExplorerClient } from '@uvx/uvx-client';
import { mockDeviceGuids, mockDeviceGuids2, mockDeviceList, mockDeviceList2 } from 'mock_data/devices';
import { DataClient } from '@data/data-client';
import { DocumentClient } from 'src/doc/document-client';

jest.mock('lucid-extension-sdk');
jest.mock('@data/data-client');
jest.mock('model/uvx/network');
jest.mock('model/uvx/device');
jest.mock('@uvx/uvx-client');

describe('Connected Devices Modal Tests', () => {
    const mockEditorClient = new lucid.EditorClient();
    const mockViewport = {
        getCurrentPage: () => {
            return { id: '1' };
        }
    } as lucid.Viewport;
    const mockDataClient = DataClient.getInstance(mockEditorClient);

    const mockDocClient = new DocumentClient(mockViewport, mockDataClient);
    const mockUvxClient = new UVExplorerClient(mockEditorClient);
    const mockNetworkRequest = {
        network_guid: 'myNetwork'
    };
    const mockConnectedDevicesRequest = {
        device_guids: mockDeviceGuids
    };
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should correctly pull in uvx client mock', async () => {
        const testClient = new UVExplorerClient(mockEditorClient);
        await expect(testClient.listDevices({} as devicesModel.DeviceListRequest)).resolves.toEqual(mockDeviceList);
    });

    describe('Load connected devices tests', () => {
        const networkRequestSpy = jest.spyOn(model, 'NetworkRequest').mockReturnValue(mockNetworkRequest);
        const connectedDevicesRequestSpy = jest
            .spyOn(devicesModel, 'ConnectedDevicesRequest')
            .mockReturnValue(mockConnectedDevicesRequest);
        const modal = new ConnectedDevicesModal(
            mockEditorClient,
            mockDocClient,
            mockUvxClient,
            mockDataClient,
            mockDeviceGuids,
            mockDeviceGuids2
        );
        jest.spyOn(modal, 'loadPageNetwork').mockResolvedValue();

        const sendMessageMock = jest.spyOn(modal, 'sendMessage');

        it('Should make uvx request and send message to child', async () => {
            await modal.sendConnectedDevices('My Network');

            expect(networkRequestSpy).toHaveBeenCalledWith('My Network');
            expect(connectedDevicesRequestSpy).toHaveBeenCalledWith(mockDeviceGuids);
            expect(sendMessageMock).toHaveBeenCalledWith({
                action: 'listDevices',
                devices: JSON.stringify(mockDeviceList2),
                backButton: false,
                visibleConnectedDeviceGuids: JSON.stringify(mockDeviceGuids2),
                networkName: 'My Network'
            });
        });
    });
});
