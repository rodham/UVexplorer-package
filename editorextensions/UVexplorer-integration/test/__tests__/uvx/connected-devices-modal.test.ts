import { ConnectedDevicesModal } from '@uvx/connected-devices-modal';
import * as model from 'model/uvx/network';
import * as devicesModel from 'model/uvx/device';
import * as lucid from 'lucid-extension-sdk';
import { UVExplorerClient } from '@uvx/uvx-client';
import { mockDeviceGuids, mockDeviceGuids2, mockDeviceList, mockDeviceList2 } from 'mock_data/devices';
import { Data } from '@data/data';
import { DocumentEditor } from 'src/doc/documentEditor';

jest.mock('lucid-extension-sdk');
jest.mock('@data/data');
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
    const mockData = Data.getInstance(mockEditorClient);
    const mockDocEditor = new DocumentEditor(mockViewport, mockData);
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
        const modal = new ConnectedDevicesModal(mockEditorClient, mockDocEditor, mockDeviceGuids, mockDeviceGuids2);
        const sendMessageMock = jest.spyOn(modal, 'sendMessage');

        it('Should make uvx request and send message to child', async () => {
            await modal.loadConnectedDevices();

            expect(networkRequestSpy).toHaveBeenCalledWith('My Network');
            expect(connectedDevicesRequestSpy).toHaveBeenCalledWith(mockDeviceGuids);
            expect(sendMessageMock).toHaveBeenCalledWith({
                action: 'listDevices',
                devices: JSON.stringify(mockDeviceList2),
                visibleConnectedDeviceGuids: JSON.stringify(mockDeviceGuids2)
            });
        });
    });
});
