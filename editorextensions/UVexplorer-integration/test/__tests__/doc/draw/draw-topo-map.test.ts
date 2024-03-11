import * as lucid from 'lucid-extension-sdk';
import { DataClient } from '@data/data-client';
import { DrawBlocks } from 'src/doc/draw/draw-blocks';
import { DrawLines } from 'src/doc/draw/draw-lines';
import { DrawTopoMap } from 'src/doc/draw/draw-topo-map';
import { BlockProxy } from 'lucid-extension-sdk';
import { mockCustomBlockDefinition, mockTopoMap } from '../../helpers';
import { NetworkDeviceBlock } from '@blocks/network-device-block';

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
            await DrawTopoMap.drawTopoMap(mockClient, mockViewport, mockPage, mockTopoMap);

            expect(getCustomShapeDefSpy).toHaveBeenCalledWith(NetworkDeviceBlock.library, NetworkDeviceBlock.shape);
            expect(getInstanceSpy).not.toHaveBeenCalled();
        });

        it('should draw blocks and lines when custom shape definition is available', async () => {
            const getCustomShapeDefSpy = jest
                .spyOn(mockClient, 'getCustomShapeDefinition')
                .mockResolvedValue(mockCustomBlockDefinition);
            const getInstanceSpy = jest.spyOn(DataClient, 'getInstance');

            const mockGuidToBlockMap = new Map<string, BlockProxy>();
            const drawBlocksSpy = jest.spyOn(DrawBlocks, 'drawBlocks').mockReturnValue(mockGuidToBlockMap);
            const drawLinesSpy = jest.spyOn(DrawLines, 'drawLines');

            await DrawTopoMap.drawTopoMap(mockClient, mockViewport, mockPage, mockTopoMap);

            expect(getCustomShapeDefSpy).toHaveBeenCalledWith(NetworkDeviceBlock.library, NetworkDeviceBlock.shape);
            expect(getInstanceSpy).toHaveBeenCalledWith(mockClient);
            expect(drawBlocksSpy).toHaveBeenCalledWith(
                mockViewport,
                mockPage,
                mockTopoMap.deviceNodes,
                mockCustomBlockDefinition,
                'my_network_device'
            );
            expect(drawLinesSpy).toHaveBeenCalledWith(
                mockPage,
                mockTopoMap.deviceLinks,
                mockGuidToBlockMap,
                'my_network_link',
                mockTopoMap.drawSettings
            );
        });
    });
});
