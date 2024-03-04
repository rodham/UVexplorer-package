import * as lucid from 'lucid-extension-sdk';
import {Line} from '@draw/line';
import {DeviceLink} from 'model/uvx/device';
import {BlockProxy, LineProxy} from 'lucid-extension-sdk';
import {mockDeviceLink} from '../helpers';

jest.mock('lucid-extension-sdk');
describe('Draw Line tests', () => {
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
            const mockBlocks: BlockProxy[] = [
                {} as lucid.BlockProxy,
                {} as lucid.BlockProxy
            ]
            const mockLine = new LineProxy('', mockClient);
            const setShapeSpy = jest.spyOn(mockLine, 'setShape');
            const addLineSpy = jest.spyOn(mockPage, 'addLine').mockReturnValue(mockLine);

            Line.drawLine(mockPage, mockBlocks[0], mockBlocks[1]);

            expect(addLineSpy).toHaveBeenCalledWith({
                endpoint1: {
                    connection: mockBlocks[0],
                    linkX: 0.5,
                    linkY: 1,
                    style: "none",
                },
                endpoint2: {
                    connection: mockBlocks[1],
                    linkX: 0.5,
                    linkY: 0,
                    style: "none",
                },
            });

            expect(setShapeSpy).toHaveBeenCalledWith(lucid.LineShape.Diagonal);
        });
    });

    describe('drawLines Tests', () => {
        it('should draw multiple lines', () => {
            const mockDeviceLinks: DeviceLink[] = [
                mockDeviceLink
            ];
            const mockBlocks: BlockProxy[] = [
                {} as lucid.BlockProxy,
                {} as lucid.BlockProxy,
                {} as lucid.BlockProxy
            ]
            for (const mockBlock of mockBlocks) {
                mockBlock.getBoundingBox = jest.fn(()=> {return {x:0, y:0, h:0, w:0}});
            }
            const mockGuidToBlockMap = new Map<string, BlockProxy>(
                [[mockDeviceLink.linkEdges[0].localConnection.deviceGuid, mockBlocks[0]],
                    [mockDeviceLink.linkEdges[0].remoteConnection.deviceGuid, mockBlocks[1]],
                    [mockDeviceLink.linkEdges[1].remoteConnection.deviceGuid, mockBlocks[2]]]
            );
            const mockCollectionId = 'collectionId';
            const drawLineSpy = jest.spyOn(Line, 'drawLine').mockReturnValue({} as lucid.LineProxy);
            const setReferenceKeySpy = jest.spyOn(Line, 'setReferenceKey').mockImplementation();

            Line.drawLines(mockPage, mockDeviceLinks, mockGuidToBlockMap, mockCollectionId);

            expect(drawLineSpy).toHaveBeenCalledTimes(mockDeviceLink.linkEdges.length);
            expect(setReferenceKeySpy).toHaveBeenCalledTimes(mockDeviceLink.linkEdges.length);
        });
    });
});
