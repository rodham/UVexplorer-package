import * as lucid from 'lucid-extension-sdk';
import { mockCustomBlockDefinition, mockDeviceNode } from '../helpers';
import { DrawBlocks } from '@draw/draw-blocks';
import { DeviceNode } from 'model/uvx/device';

jest.mock('lucid-extension-sdk');
describe('DrawTopoMap Block Tests', () => {
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

    describe('drawBlock Tests', () => {
        it('should add a block with the correct properties', () => {
            const mockBlock: lucid.BlockProxy = {} as lucid.BlockProxy;
            const mockCollectionId = 'collectionId';
            const addBlockSpy = jest.spyOn(mockPage, 'addBlock').mockReturnValue(mockBlock);
            const setShapeDataSpy = jest.spyOn(DrawBlocks, 'setShapeData').mockImplementation();
            const setReferenceKeySpy = jest.spyOn(DrawBlocks, 'setReferenceKey').mockImplementation();

            const result = DrawBlocks.drawBlock(mockPage, mockDeviceNode, mockCustomBlockDefinition, mockCollectionId);
            expect(addBlockSpy).toHaveBeenCalledWith({
                ...mockCustomBlockDefinition,
                boundingBox: { x: mockDeviceNode.x, y: mockDeviceNode.y, w: 50, h: 50 }
            });
            expect(setShapeDataSpy).toHaveBeenCalledWith(mockBlock, mockDeviceNode);
            expect(setReferenceKeySpy).toHaveBeenCalledWith(mockBlock, mockDeviceNode, mockCollectionId);
            expect(result).toBe(mockBlock);
        });
    });

    describe('drawBlocks Tests', () => {
        it('should draw multiple blocks and focus camera on them', () => {
            const mockDeviceNodes: DeviceNode[] = [mockDeviceNode, { ...mockDeviceNode, deviceGuid: 'otherGuid' }];
            const mockBlocks: lucid.BlockProxy[] = [{} as lucid.BlockProxy, {} as lucid.BlockProxy];
            const mockCollectionId = 'collectionId';
            const drawBlockSpy = jest.spyOn(DrawBlocks, 'drawBlock').mockReturnValue({} as lucid.BlockProxy);
            const focusCameraOnItemsSpy = jest.spyOn(mockViewport, 'focusCameraOnItems');

            const guidToBlockMap = DrawBlocks.drawBlocks(
                mockViewport,
                mockPage,
                mockDeviceNodes,
                mockCustomBlockDefinition,
                mockCollectionId
            );
            expect(drawBlockSpy).toHaveBeenCalledTimes(mockDeviceNodes.length);
            expect(focusCameraOnItemsSpy).toHaveBeenCalledWith(mockBlocks);
            expect(guidToBlockMap.size).toBe(mockDeviceNodes.length);
        });
    });
});
