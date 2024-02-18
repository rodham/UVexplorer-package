import { ConnectedDevicesModal } from '@uvx/connected-devices-modal';
import * as dataColls from 'src/data-collections';
import * as model from 'model/uvexplorer-model';
import * as lucid from 'lucid-extension-sdk';
import { UVExplorerClient } from '@uvx/uvx-client';
import { mockDeviceGuids, mockDeviceList, mockDeviceList2 } from 'mock_data/devices';

jest.mock('lucid-extension-sdk');
jest.mock('src/data-collections');
jest.mock('model/uvexplorer-model');
jest.mock('@uvx/uvx-client');

describe('Connected Devices Modal Tests', () => {
    const mockEditorClient = new lucid.EditorClient();
    const mockViewport = {
        getCurrentPage: () => {
            return { id: '1' };
        }
    } as lucid.Viewport;
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
        await expect(testClient.listDevices('', '', {} as model.DeviceListRequest)).resolves.toEqual(mockDeviceList);
    });

    describe('Load connected devices tests', () => {
        const getNetworkSpy = jest.spyOn(dataColls, 'getNetworkForPage').mockReturnValue('myNetwork');
        const networkRequestSpy = jest.spyOn(model, 'NetworkRequest').mockReturnValue(mockNetworkRequest);
        const connectedDevicesRequestSpy = jest
            .spyOn(model, 'ConnectedDevicesRequest')
            .mockReturnValue(mockConnectedDevicesRequest);
        const modal = new ConnectedDevicesModal(mockEditorClient, mockViewport, mockDeviceGuids);
        const sendMessageMock = jest.spyOn(modal, 'sendMessage');

        it('Should make uvx request and send message to child', async () => {
            await modal.loadConnectedDevices();

            expect(getNetworkSpy).toHaveBeenCalledWith('1');
            expect(networkRequestSpy).toHaveBeenCalledWith('myNetwork');
            expect(connectedDevicesRequestSpy).toHaveBeenCalledWith(mockDeviceGuids);
            expect(sendMessageMock).toHaveBeenCalledWith({
                action: 'listDevices',
                devices: JSON.stringify(mockDeviceList2)
            });
        });
    });
});
