import { uvDeviceSelected, showConnectedDevices } from '@actions/devices';
import * as lucid from 'lucid-extension-sdk';
import { BlockUtils } from '@blocks/block-utils';
import { mockSelectedNetworkDevices } from 'mock_data/devices';
import { DocumentClient } from 'src/doc/document-client';
import { DataClient } from '@data/data-client';
import { UVExplorerClient } from '@uvx/uvx-client';

jest.mock('lucid-extension-sdk');
jest.mock('@data/data-client');
jest.mock('src/doc/draw/draw-topo-map');
jest.mock('@uvx/connected-devices-modal');

beforeEach(() => {
    jest.resetModules();
});

describe('Device actions success tests', () => {
    const mockClient = new lucid.EditorClient();
    const mockSelection = mockSelectedNetworkDevices as lucid.ItemProxy[];
    const mockViewport = {
        getSelectedItems: (_deep?: boolean | undefined) => mockSelection
    } as lucid.Viewport;
    const mockDataClient = DataClient.getInstance(mockClient);
    const mockDocEditor = new DocumentClient(mockViewport, mockDataClient);
    const mockUvxClient = new UVExplorerClient(mockClient);

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('uvDeviceSelected tests', () => {
        it('should be true when multiple uvDevices are selected', () => {
            jest.spyOn(BlockUtils, 'isNetworkDeviceBlock').mockReturnValue(true);
            expect(uvDeviceSelected(mockViewport)).toBeTruthy();
        });
    });

    describe('showConnectedDevices tests', () => {
        it('should call console.log with selected items', async () => {
            const isNetworkDeviceBlockSpy = jest.spyOn(BlockUtils, 'isNetworkDeviceBlock').mockReturnValue(true);
            await showConnectedDevices(mockSelection, mockClient, mockDocEditor, mockUvxClient, mockDataClient);
            expect(isNetworkDeviceBlockSpy).toHaveBeenCalledWith(mockSelectedNetworkDevices[0]);
        });
    });
});
