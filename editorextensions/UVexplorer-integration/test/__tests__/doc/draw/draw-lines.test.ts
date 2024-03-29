import * as lucid from 'lucid-extension-sdk';
import { DrawLines } from 'src/doc/draw/draw-lines';
import { BlockProxy, LineProxy } from 'lucid-extension-sdk';
import { mockDeviceLink, mockTopoMap } from '../../helpers';
import { PenPattern } from 'model/uvx/topo-map';
import { mockDisplayEdgeSet } from 'mock_data/devices';

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
            const changeZOrderSpy = jest.spyOn(mockLine, 'changeZOrder');
            const addLineSpy = jest.spyOn(mockPage, 'addLine').mockReturnValue(mockLine);

            DrawLines.drawLine(mockPage, mockBlocks[0], mockBlocks[1], mockPenSettings, "");

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
            expect(changeZOrderSpy).toHaveBeenCalledWith(lucid.ZOrderOperation.BOTTOM);
            // properties is undefined for the setShapeSpy, so we cannot test that
        });
    });

    describe('drawLines Tests', () => {
        it('should draw lines', () => {
            const mockBlocks: BlockProxy[] = [{} as lucid.BlockProxy, {} as lucid.BlockProxy, {} as lucid.BlockProxy];
            const mockNodeIdToBlockMap = new Map<number, BlockProxy>([
                [mockDeviceLink.linkEdges[0].localConnection.nodeId, mockBlocks[0]],
                [mockDeviceLink.linkEdges[0].remoteConnection.nodeId, mockBlocks[1]],
                [mockDeviceLink.linkEdges[1].remoteConnection.nodeId, mockBlocks[2]]
            ]);
            const mockCollectionId = 'collectionId';
            const mockDrawSettings = mockTopoMap.drawSettings;
            const drawLineSpy = jest.spyOn(DrawLines, 'drawLine').mockReturnValue({} as lucid.LineProxy);
            const setReferenceKeySpy = jest.spyOn(DrawLines, 'setReferenceKey').mockImplementation();

            DrawLines.drawLines(mockPage, mockDisplayEdgeSet, mockNodeIdToBlockMap, mockCollectionId, mockDrawSettings, false);

            expect(drawLineSpy).toHaveBeenCalledTimes(mockDisplayEdgeSet.map.size);
            expect(setReferenceKeySpy).toHaveBeenCalledTimes(mockDisplayEdgeSet.map.size);
        });
    });
});
