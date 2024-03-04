import * as lucid from 'lucid-extension-sdk';
import { DeviceNode, DeviceLink } from 'model/uvx/device';
import {Data} from '@data/data';
import {DrawBlocks} from '@draw/draw-blocks';
import {DrawLines} from '@draw/draw-lines';
import { DrawTopoMap } from '@draw/draw-topo-map';
import {BlockProxy} from "lucid-extension-sdk";
import {mockCustomBlockDefinition} from "../helpers";
import {NetworkDeviceBlock} from "@blocks/network-device-block";

jest.mock('lucid-extension-sdk');
jest.mock('@data/data');
jest.mock('@draw/draw-blocks');
jest.mock('@draw/draw-lines');

describe('Map', () => {
    let mockClient: lucid.EditorClient;
    let mockViewport: lucid.Viewport;
    let mockPage: lucid.PageProxy;
    let mockDeviceNodes: DeviceNode[];
    let mockDeviceLinks: DeviceLink[];

    beforeEach(() => {
        mockClient = new lucid.EditorClient();
        mockViewport = new lucid.Viewport(mockClient);
        mockPage = new lucid.PageProxy('', mockClient);
        mockDeviceNodes = [];
        mockDeviceLinks = [];
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('drawMap', () => {
        it('should do nothing if custom shape definition is not available', async () => {
            const getCustomShapeDefSpy = jest.spyOn(mockClient, 'getCustomShapeDefinition').mockResolvedValue(undefined);
            const getInstanceSpy = jest.spyOn(Data, 'getInstance');
            await DrawTopoMap.drawTopoMap(mockClient, mockViewport, mockPage, mockDeviceNodes, mockDeviceLinks);

            expect(getCustomShapeDefSpy).toHaveBeenCalledWith(NetworkDeviceBlock.library, NetworkDeviceBlock.shape);
            expect(getInstanceSpy).not.toHaveBeenCalled()
        });

        it('should draw blocks and lines when custom shape definition is available', async () => {
            const getCustomShapeDefSpy = jest.spyOn(mockClient, 'getCustomShapeDefinition').mockResolvedValue(mockCustomBlockDefinition);
            const getInstanceSpy = jest.spyOn(Data, 'getInstance');

            const mockGuidToBlockMap = new Map<string, BlockProxy>();
            const drawBlocksSpy = jest.spyOn(DrawBlocks, 'drawBlocks').mockReturnValue(mockGuidToBlockMap);
            const drawLinesSpy = jest.spyOn(DrawLines, 'drawLines');

            await DrawTopoMap.drawTopoMap(mockClient, mockViewport, mockPage, mockDeviceNodes, mockDeviceLinks);

            expect(getCustomShapeDefSpy).toHaveBeenCalledWith(NetworkDeviceBlock.library, NetworkDeviceBlock.shape);
            expect(getInstanceSpy).toHaveBeenCalledWith(mockClient);
            expect(drawBlocksSpy).toHaveBeenCalledWith(mockViewport, mockPage, mockDeviceNodes, mockCustomBlockDefinition, 'my_network_device');
            expect(drawLinesSpy).toHaveBeenCalledWith(mockPage, mockDeviceLinks, mockGuidToBlockMap, 'my_network_link');
        });
    });
});
