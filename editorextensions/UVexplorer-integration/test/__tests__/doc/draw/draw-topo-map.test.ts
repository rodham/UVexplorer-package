import * as lucid from 'lucid-extension-sdk';
import { DataClient } from '@data/data-client';
import { DrawBlocks } from 'src/doc/draw/draw-blocks';
import { DrawLines } from 'src/doc/draw/draw-lines';
import { DrawTopoMap } from 'src/doc/draw/draw-topo-map';
import { BlockProxy } from 'lucid-extension-sdk';
import { mockCustomBlockDefinition, mockTopoMap } from '../../helpers';
import { NetworkDeviceBlock } from '@blocks/network-device-block';
import { defaultImageSettings, TopoMap } from 'model/uvx/topo-map';
import { mockDisplayEdgeSet } from 'mock_data/devices';

jest.mock('lucid-extension-sdk');
jest.mock('@data/data-client');
jest.mock('src/doc/draw/draw-blocks');
jest.mock('src/doc/draw/draw-lines');

describe('Map', () => {
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

    describe('drawMap', () => {
        it('should do nothing if custom shape definition is not available', async () => {
            const getCustomShapeDefSpy = jest
                .spyOn(mockClient, 'getCustomShapeDefinition')
                .mockResolvedValue(undefined);
            const getInstanceSpy = jest.spyOn(DataClient, 'getInstance');
            await DrawTopoMap.drawTopoMap(mockClient, mockViewport, mockPage, mockTopoMap, defaultImageSettings);

            expect(getCustomShapeDefSpy).toHaveBeenCalledWith(NetworkDeviceBlock.library, NetworkDeviceBlock.shape);
            expect(getInstanceSpy).not.toHaveBeenCalled();
        });

        it('should draw blocks and lines when custom shape definition is available', async () => {
            const mockTopoMapWithDisplayEdges = {...mockTopoMap, displayEdges: mockDisplayEdgeSet} as TopoMap;
            const getCustomShapeDefSpy = jest
                .spyOn(mockClient, 'getCustomShapeDefinition')
                .mockResolvedValue(mockCustomBlockDefinition);
            const getInstanceSpy = jest.spyOn(DataClient, 'getInstance');

            const mockNodeIdToBlockMap = new Map<number, BlockProxy>();
            const drawBlocksSpy = jest.spyOn(DrawBlocks, 'drawBlocks').mockReturnValue(mockNodeIdToBlockMap);
            const drawLinesSpy = jest.spyOn(DrawLines, 'drawLines');

            await DrawTopoMap.drawTopoMap(mockClient, mockViewport, mockPage, mockTopoMapWithDisplayEdges, defaultImageSettings);

            expect(getCustomShapeDefSpy).toHaveBeenCalledWith(NetworkDeviceBlock.library, NetworkDeviceBlock.shape);
            expect(getInstanceSpy).toHaveBeenCalledWith(mockClient);
            expect(drawBlocksSpy).toHaveBeenCalledWith(
                mockViewport,
                mockPage,
                mockTopoMapWithDisplayEdges.deviceNodes,
                mockTopoMapWithDisplayEdges.hubNodes,
                mockCustomBlockDefinition,
                'my_network_device',
                defaultImageSettings
            );
            expect(drawLinesSpy).toHaveBeenCalledWith(
                mockPage,
                mockTopoMapWithDisplayEdges.displayEdges,
                mockNodeIdToBlockMap,
                'my_network_display_edge',
                mockTopoMap.drawSettings
            );
        });
    });
});
