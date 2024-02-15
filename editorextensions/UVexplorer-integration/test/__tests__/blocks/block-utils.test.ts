import * as lucid from 'lucid-extension-sdk';
import * as blocks from '@blocks/block-utils';
import { Device } from 'model/uvexplorer-model';
import { DeviceNode } from 'model/bundle/code/dtos/topology/DeviceNode';

jest.mock('lucid-extension-sdk');

beforeEach(() => {
    jest.resetModules();
});

describe('block-utils success test', () => {
    const mockClient = new lucid.EditorClient();
    const mockViewport = new lucid.Viewport(mockClient);
    const devices: Device[] = [];
    const deviceNodes: DeviceNode[] = [];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('drawBlocks tests', () => {
        it('should draw same number of blocks as devices when any number of devices are given', () => {
            jest.spyOn(blocks, 'isNetworkDeviceBlock').mockReturnValue(true);
            // TODO: Check if number of AddBlock calls is what we expect
            expect(blocks.drawBlocks(mockClient, mockViewport, devices, deviceNodes)).toBeUndefined();
        });
        it('should have correct company and deviceType for each block when given data with this information', () => {
            jest.spyOn(blocks, 'isNetworkDeviceBlock').mockReturnValue(true);
            //TODO: Check the return values of getCompany and getDeviceTypt
        });
    });

    describe('drawLinks tests', () => {
        it('should draw same number of links as deviceLinks when any number of deviceLinks are given', () => {
            // TODO: Check if number of connectBlocks calls is what we expect
        });
    });
});
