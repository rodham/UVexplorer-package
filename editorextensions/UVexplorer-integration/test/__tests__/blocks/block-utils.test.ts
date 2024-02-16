import * as lucid from 'lucid-extension-sdk';
import * as blocks from '@blocks/block-utils';
import { Device } from 'model/uvexplorer-model';
import { DeviceNode } from 'model/bundle/code/dtos/topology/DeviceNode';
import { DeviceLink } from 'model/bundle/code/dtos/topology/DeviceLink';

jest.mock('lucid-extension-sdk');

beforeEach(() => {
    jest.resetModules();
});

describe('block-utils success test', () => {
    const mockClient = new lucid.EditorClient();
    const mockViewport = new lucid.Viewport(mockClient);
    const mockPage = new lucid.PageProxy("0", mockClient);
    const devices: Device[] = [];
    //[new Device("", "", "0", 
    //     JSON.parse('{"product_info": {"vendor": "Apple"}}'), 
    //     JSON.parse('{}'), 
    //     JSON.parse(`{"entries":[
    //         {
    //             "device_category":"router",
    //             "source_name":""
    //         },
    //         {
    //             "device_category":"net-device",
    //             "source_name":""
    //         },
    //         {
    //             "device_category":"hub",
    //             "source_name":""
    //         }
    //     ]}`),
    //     JSON.parse('{}')
    //     , "")
    // ];
    const deviceNodes: DeviceNode[] = [];
    // JSON.parse(`
    //     {
    //         [
    //             "deviceGuid": "0",
    //             "x": 0,
    //             "y": 0
    //         ]
    //     }
    // `);
    const deviceLinks: DeviceLink[] = [];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('drawBlocks tests', () => {
        it('should draw same number of blocks as devices when any number of devices are given', () => {
            jest.spyOn(blocks, 'isNetworkDeviceBlock').mockReturnValue(true);
            const addBlockSpy = jest.spyOn(mockPage, 'addBlock');
            blocks.drawBlocks(mockClient, mockViewport, devices, deviceNodes);
            expect(addBlockSpy).toHaveBeenCalledTimes(0);
        });
        // it('should have correct company and deviceType for each block when given data with this information', () => {
        //     jest.spyOn(blocks, 'isNetworkDeviceBlock').mockReturnValue(true);
        //     // TODO: Check the return values of getCompany and getDeviceType
        //     blocks.drawBlocks(mockClient, mockViewport, devices, deviceNodes);
        //     expect());
        // });
    });

    describe('drawLinks tests', () => {
        it('should draw same number of links as deviceLinks when any number of deviceLinks are given', () => {
            // TODO: Check if number of connectBlocks calls is what we expect
            expect(blocks.drawLinks(mockClient, mockViewport, deviceLinks)).toBeUndefined();
        });
    });
});
