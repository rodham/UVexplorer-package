import * as lucid from 'lucid-extension-sdk';
import {mockCustomBlockDefinition, mockDeviceNode} from "../helpers";
import {Block} from '@draw/block';

jest.mock('lucid-extension-sdk');
describe('Block class', () => {
    let mockClient: lucid.EditorClient;
    let mockViewport: lucid.Viewport;
    let mockPage: lucid.PageProxy;


    beforeEach(() => {
        mockClient = new lucid.EditorClient();
        mockViewport = new lucid.Viewport(mockClient);
        mockPage = new lucid.PageProxy('', mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('drawBlock method', () => {
        it('should add a block with the correct properties', () => {
            const mockBlock: lucid.BlockProxy = {} as lucid.BlockProxy;
            const mockCollectionId = 'collectionId'
            const addBlockSpy = jest.spyOn(mockPage, 'addBlock').mockReturnValue(mockBlock);
            const setShapeDataSpy = jest.spyOn(Block, 'setShapeData').mockImplementation();
            const setReferenceKeySpy = jest.spyOn(Block, 'setReferenceKey').mockImplementation();
            const result = Block.drawBlock(mockPage, mockDeviceNode, mockCustomBlockDefinition, mockCollectionId);

            expect(addBlockSpy).toHaveBeenCalledWith({
                ...mockCustomBlockDefinition,
                boundingBox: { x: mockDeviceNode.x, y: mockDeviceNode.y, w: 50, h: 50 }
            });
            expect(setShapeDataSpy).toHaveBeenCalledWith(mockBlock, mockDeviceNode);
            expect(setReferenceKeySpy).toHaveBeenCalledWith(mockBlock, mockDeviceNode, mockCollectionId);

            expect(result).toBe(mockBlock);
        });
        //
        // it('should set shapeData and referenceKey correctly', () => {
        //     // Similar setup as the previous test
        //
        //     const deviceNode: DeviceNode = {
        //         deviceGuid: 'testGuid',
        //         x: 10,
        //         y: 20
        //         // Add other required properties
        //     };
        //
        //     const customBlockDef = { /* Custom block definition */ };
        //     const collectionId = 'testCollection';
        //
        //     const resultBlock: BlockProxy = {} as BlockProxy;
        //
        //     (mockPage.addBlock as jest.Mock).mockReturnValue(resultBlock);
        //
        //     const block = Block.drawBlock(mockPage, deviceNode, customBlockDef, collectionId);
        //
        //     expect(block.shapeData.set).toHaveBeenCalledWith('Make', getVendor(deviceNode));
        //     expect(block.shapeData.set).toHaveBeenCalledWith('DeviceType', getDeviceType(deviceNode));
        //     expect(block.shapeData.set).toHaveBeenCalledWith('Guid', deviceNode.deviceGuid);
        //
        //     expect(block.setReferenceKey).toHaveBeenCalledWith(DEVICE_REFERENCE_KEY, {
        //         collectionId: collectionId,
        //         primaryKey: `"${deviceNode.deviceGuid}"`,
        //         readonly: true
        //     });
        // });
    });
    //
    // describe('drawBlocks method', () => {
    //     it('should draw multiple blocks and focus camera on them', () => {
    //         const deviceNodes: DeviceNode[] = [
    //             { deviceGuid: 'guid1', x: 10, y: 20 },
    //             { deviceGuid: 'guid2', x: 30, y: 40 },
    //             // Add more device nodes
    //         ];
    //
    //         const customBlockDef = { /* Custom block definition */ };
    //         const collectionId = 'testCollection';
    //
    //         const resultBlocks: BlockProxy[] = [
    //             {} as BlockProxy,
    //             {} as BlockProxy
    //             // Add more blocks
    //         ];
    //
    //         (mockPage.addBlock as jest.Mock).mockImplementation(() => resultBlocks.shift());
    //
    //         const guidToBlockMap = Block.drawBlocks(mockViewport, mockPage, deviceNodes, customBlockDef, collectionId);
    //
    //         expect(mockPage.addBlock).toHaveBeenCalledTimes(deviceNodes.length);
    //         expect(mockPage.focusCameraOnItems).toHaveBeenCalledWith(resultBlocks);
    //         expect(guidToBlockMap.size).toBe(deviceNodes.length);
    //
    //         // Add additional assertions for guidToBlockMap
    //     });
    // });
});
