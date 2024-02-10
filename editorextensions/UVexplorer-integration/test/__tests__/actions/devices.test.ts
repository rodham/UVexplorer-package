import { uvDeviceSelected, showConnectedDevices } from '@actions/devices';
import * as lucid from 'lucid-extension-sdk';

jest.mock('lucid-extension-sdk');

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
            expect(uvDeviceSelected(mockViewport)).toBeTruthy();
        });
    });

    describe('showConnectedDevices tests', () => {
        it('should call console.log with selected items', () => {
            const logSpy = jest.spyOn(console, 'log');
            showConnectedDevices(mockViewport, mockClient);
            expect(logSpy).toHaveBeenCalledWith('Selection:', mockSelection);
        });
    });
});
