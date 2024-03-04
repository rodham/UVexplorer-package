import { uvDeviceSelected, showConnectedDevices } from '@actions/devices';
import * as lucid from 'lucid-extension-sdk';
import { BlockUtils } from '@blocks/block-utils';

jest.mock('lucid-extension-sdk');
jest.mock('@draw/draw');

beforeEach(() => {
    jest.resetModules();
});

describe('Device actions success tests', () => {
    const mockClient = new lucid.EditorClient();
    const mockSelection = [
        new lucid.BlockProxy('1', mockClient),
        new lucid.BlockProxy('1', mockClient)
    ] as lucid.ItemProxy[];
    const mockViewport = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getSelectedItems: (_deep?: boolean | undefined) => mockSelection
    } as lucid.Viewport;

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
        it.skip('should call console.log with selected items', async () => {
            const logSpy = jest.spyOn(console, 'log');
            await showConnectedDevices(mockViewport, mockClient);
            expect(logSpy).toHaveBeenCalledWith('Selection:', mockSelection);
        });
    });
});
