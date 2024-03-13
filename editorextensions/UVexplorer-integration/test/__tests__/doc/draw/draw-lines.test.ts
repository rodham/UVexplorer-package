import * as lucid from 'lucid-extension-sdk';
import { DrawLines } from 'src/doc/draw/draw-lines';
import { DeviceLink } from 'model/uvx/device';
import { BlockProxy, LineProxy } from 'lucid-extension-sdk';
import { mockDeviceLink, mockTopoMap } from '../../helpers';
import { PenPattern } from 'model/uvx/topo-map';

jest.mock('lucid-extension-sdk');
describe('DrawTopoMap DrawLines tests', () => {
    let mockClient: lucid.EditorClient;
    let mockPage: lucid.PageProxy;

    beforeEach(() => {
        mockClient = new lucid.EditorClient();
        mockPage = new lucid.PageProxy('', mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('drawLine Tests', () => {
        it('should add a line with the correct properties', () => {
            const mockBlocks: BlockProxy[] = [{} as lucid.BlockProxy, {} as lucid.BlockProxy];
            const mockPenSettings = {} as PenPattern;
            const mockLine = new LineProxy('', mockClient);
            const setShapeSpy = jest.spyOn(mockLine, 'setShape');
            const addLineSpy = jest.spyOn(mockPage, 'addLine').mockReturnValue(mockLine);

            DrawLines.drawLine(mockPage, mockBlocks[0], mockBlocks[1], mockPenSettings);

            expect(addLineSpy).toHaveBeenCalledWith({
                endpoint1: {
                    connection: mockBlocks[0],
                    linkX: 0.5,
                    linkY: 0.5,
                    style: 'none'
                },
                endpoint2: {
                    connection: mockBlocks[1],
                    linkX: 0.5,
                    linkY: 0.5,
                    style: 'none'
                }
            });

            expect(setShapeSpy).toHaveBeenCalledWith(lucid.LineShape.Diagonal);
        });
    });

    describe('drawLines Tests', () => {
        it('should draw multiple lines', () => {
            const mockDeviceLinks: DeviceLink[] = [mockDeviceLink];
            const mockBlocks: BlockProxy[] = [{} as lucid.BlockProxy, {} as lucid.BlockProxy, {} as lucid.BlockProxy];
            for (const mockBlock of mockBlocks) {
                mockBlock.getBoundingBox = jest.fn(() => {
                    return { x: 0, y: 0, h: 0, w: 0 };
                });
            }
            const mockNodeIdToBlockMap = new Map<number, BlockProxy>([
                [mockDeviceLink.linkEdges[0].localConnection.nodeId, mockBlocks[0]],
                [mockDeviceLink.linkEdges[0].remoteConnection.nodeId, mockBlocks[1]],
                [mockDeviceLink.linkEdges[1].remoteConnection.nodeId, mockBlocks[2]]
            ]);
            const mockCollectionId = 'collectionId';
            const mockDrawSettings = mockTopoMap.drawSettings;
            const drawLineSpy = jest.spyOn(DrawLines, 'drawLine').mockReturnValue({} as lucid.LineProxy);
            const setReferenceKeySpy = jest.spyOn(DrawLines, 'setReferenceKey').mockImplementation();

            DrawLines.drawLines(mockPage, mockDeviceLinks, mockNodeIdToBlockMap, mockCollectionId, mockDrawSettings);

            expect(drawLineSpy).toHaveBeenCalledTimes(mockDeviceLink.linkEdges.length);
            expect(setReferenceKeySpy).toHaveBeenCalledTimes(mockDeviceLink.linkEdges.length);
        });
    });
});
