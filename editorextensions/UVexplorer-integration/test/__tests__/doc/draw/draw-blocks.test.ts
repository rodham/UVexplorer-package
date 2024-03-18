import * as lucid from 'lucid-extension-sdk';
import { mockCustomBlockDefinition, mockDeviceNode, mockHubNode } from '../../helpers';
import { DrawBlocks } from 'src/doc/draw/draw-blocks';
import { DeviceNode } from 'model/uvx/device';
import { HubNode } from 'model/uvx/hub-node';
import { defaultImageSettings } from 'model/uvx/topo-map';

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

            const result = DrawBlocks.drawDeviceNode(
                mockPage,
                mockDeviceNode,
                mockCustomBlockDefinition,
                mockCollectionId,
                defaultImageSettings
            );
            expect(addBlockSpy).toHaveBeenCalledWith({
                ...mockCustomBlockDefinition,
                boundingBox: { x: mockDeviceNode.x, y: mockDeviceNode.y, w: 50, h: 50 }
            });
            expect(setShapeDataSpy).toHaveBeenCalledWith(mockBlock, mockDeviceNode, defaultImageSettings);
            expect(setReferenceKeySpy).toHaveBeenCalledWith(mockBlock, mockDeviceNode, mockCollectionId);
            expect(result).toBe(mockBlock);
        });
    });

    describe('drawBlocks Tests', () => {
        it('should draw multiple blocks and focus camera on them', () => {
            const mockDeviceNodes: DeviceNode[] = [mockDeviceNode, { ...mockDeviceNode, nodeId: 1 }];
            const mockHubNodes: HubNode[] = [mockHubNode];
            const mockBlocks: lucid.BlockProxy[] = [
                {} as lucid.BlockProxy,
                {} as lucid.BlockProxy,
                {} as lucid.BlockProxy
            ];
            const mockCollectionId = 'collectionId';
            const drawDeviceNodeSpy = jest.spyOn(DrawBlocks, 'drawDeviceNode').mockReturnValue({} as lucid.BlockProxy);
            const drawHubNodeSpy = jest.spyOn(DrawBlocks, 'drawHubNode').mockReturnValue({} as lucid.BlockProxy);
            const focusCameraOnItemsSpy = jest.spyOn(mockViewport, 'focusCameraOnItems');

            const nodeIdToBlockMap = DrawBlocks.drawBlocks(
                mockViewport,
                mockPage,
                mockDeviceNodes,
                mockHubNodes,
                mockCustomBlockDefinition,
                mockCollectionId,
                defaultImageSettings
            );
            expect(drawDeviceNodeSpy).toHaveBeenCalledTimes(mockDeviceNodes.length);
            expect(drawHubNodeSpy).toHaveBeenCalledTimes(mockHubNodes.length);
            expect(focusCameraOnItemsSpy).toHaveBeenCalledWith(mockBlocks);
            expect(nodeIdToBlockMap.size).toBe(mockDeviceNodes.length + mockHubNodes.length);
        });
    });
});
