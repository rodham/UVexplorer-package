jest.mock('lucid-extension-sdk');

beforeEach(() => {
    jest.resetModules();
});

describe('block-utils success test', () => {
    // const mockClient = new lucid.EditorClient();
    // const mockViewport = new lucid.Viewport(mockClient);
    // const mockPage = new lucid.PageProxy('0', mockClient);
    // const mockCustomBlockDef: lucid.BlockDefinition = { className: 'NetworkDeviceBlock', boundingBox: {x:0, y:0, w:0, h:0}}
    // const deviceNodes: DeviceNode[] = [mockDeviceNode];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('drawBlocks tests', () => {
        // it('should create the same number of blocks as devices when any number of devices are given', () => {
        //     const mockBlock = new BlockProxy('0', mockClient);
        //     const createBlockSpy = jest.spyOn(blocks, 'createBlock').mockReturnValue(mockBlock);
        //
        //     blocks.drawBlocks(mockViewport, mockPage, deviceNodes, mockCustomBlockDef, '0');
        //     expect(createBlockSpy).toHaveBeenCalledTimes(deviceNodes.length);
        // });
        // it('should have correct company and deviceType for each block when given data with this information', () => {
        //     jest.spyOn(blocks, 'isNetworkDeviceBlock').mockReturnValue(true);
        //     // TODO: Check the return values of getCompany and getDeviceType
        //     blocks.drawBlocks(mockClient, mockViewport, devices, deviceNodes);
        //     expect());
        // });
    });

    // describe('drawLinks tests', () => {
    //     it('should draw same number of links as deviceLinks when any number of deviceLinks are given', () => {
    //         // TODO: Check if number of connectBlocks calls is what we expect
    //         expect(blocks.drawLinks(mockClient, mockViewport, deviceLinks)).toBeUndefined();
    //     });
    // });
});
