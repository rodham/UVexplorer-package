import {
    BlockProxy,
    CustomBlockProxy, ItemProxy,
    PageProxy, ReferenceKeyProxy,
} from 'lucid-extension-sdk';
import {DEVICE_REFERENCE_KEY} from '@data/data';

import * as lucid from "lucid-extension-sdk";
import * as dataUtils from '@data/data-utils';

import {BlockUtils} from "@blocks/block-utils";
import {mockDevice} from "../helpers";
import {NetworkDeviceBlock} from "@blocks/network-device-block";

jest.mock('lucid-extension-sdk', (): unknown => ({
    ...jest.requireActual('lucid-extension-sdk'),
    EditorClient: jest.fn().mockImplementation(() => ({
        sendCommand: jest.fn()
    }))
}))

beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
});

describe('BlockUtils Tests', () => {
    let mockClient: lucid.EditorClient;
    let mockBlock: lucid.BlockProxy;
    let mockPage: PageProxy;


    beforeEach(() => {
        mockClient = new lucid.EditorClient();
        mockBlock = new BlockProxy('', mockClient);
        mockPage = new PageProxy('', mockClient);
    });

    describe('isNetworkDeviceBlock Tests', () => {
        it('should return true for a valid NetworkDeviceBlock', () => {
            const mockBlock = new CustomBlockProxy('', mockClient);
            const isFromStencilSpy = jest.spyOn(mockBlock, 'isFromStencil').mockReturnValue(true);

            const result = BlockUtils.isNetworkDeviceBlock(mockBlock);

            expect(result).toBe(true);
            expect(isFromStencilSpy).toHaveBeenCalledWith(NetworkDeviceBlock.library, NetworkDeviceBlock.shape);
        });

        it('should return false for an invalid NetworkDeviceBlock', () => {
            const mockBlock = new CustomBlockProxy('', mockClient);
            const isFromStencilSpy = jest.spyOn(mockBlock, 'isFromStencil').mockReturnValue(false);

            const result = BlockUtils.isNetworkDeviceBlock(mockBlock);

            expect(result).toBe(false);
            expect(isFromStencilSpy).toHaveBeenCalledWith(NetworkDeviceBlock.library, NetworkDeviceBlock.shape);
        });

        it('should return false for a non-custom block', () => {
            const mockItem = new ItemProxy('', mockClient);

            const result = BlockUtils.isNetworkDeviceBlock(mockItem);

            expect(result).toBe(false);
        });
    });

    describe('getBlockFromGuid Tests', () => {
        it('should return the block with the specified guid if found', () => {
            mockBlock.shapeData.get = jest.fn().mockReturnValue('someGuid');
            mockPage.blocks.values = jest.fn().mockReturnValue([mockBlock]);

            const result = BlockUtils.getBlockFromGuid(mockPage, 'someGuid');
            expect(result).toBe(mockBlock);
        });

        it('should return undefined if the block with the specified guid is not found', () => {
            mockBlock.shapeData.get = jest.fn().mockReturnValue('someGuid');
            mockPage.blocks.values = jest.fn().mockReturnValue([mockBlock]);

            const result = BlockUtils.getBlockFromGuid(mockPage, 'otherGuid');
            expect(result).toBeUndefined();
        });
    });

    describe('getGuidFromBlock Tests', () => {
        it('should return the guid from the block', () => {
            const mockReferenceKeySettings = {'cid': '', 'pk': '"someGuid"'}
            const mockReferenceKey = new ReferenceKeyProxy('', DEVICE_REFERENCE_KEY, mockClient, mockReferenceKeySettings);
            mockBlock.referenceKeys.keys = jest.fn().mockReturnValue([DEVICE_REFERENCE_KEY]);
            mockBlock.referenceKeys.get = jest.fn().mockReturnValue(mockReferenceKey);

            const result = BlockUtils.getGuidFromBlock(mockBlock);
            expect(result).toBe('someGuid');
        });

        it('should return undefined if the guid is not found in the block', () => {
            mockBlock.referenceKeys.keys = jest.fn().mockReturnValue([]);
            mockBlock.referenceKeys.get = jest.fn().mockReturnValue([]);

            const result = BlockUtils.getGuidFromBlock(mockBlock);
            expect(result).toBeUndefined();
        });
    });

    describe('getDeviceFromBlock Tests', () => {
        it('should return the device from the block', () => {
            const mockReferenceKeySettings = {'cid': '', 'pk': '"someGuid"'}
            const mockReferenceKey = new ReferenceKeyProxy('', DEVICE_REFERENCE_KEY, mockClient, mockReferenceKeySettings);
            mockReferenceKey.getItem = jest.fn().mockReturnValue('test');
            mockBlock.referenceKeys.keys = jest.fn().mockReturnValue([DEVICE_REFERENCE_KEY]);
            mockBlock.referenceKeys.get = jest.fn().mockReturnValue(mockReferenceKey);
            jest.spyOn(dataUtils, 'itemToDevice').mockReturnValue(mockDevice);

            const result = BlockUtils.getDeviceFromBlock(mockBlock);
            expect(result).toBe(mockDevice);
        });

        it('should return undefined if the device is not found in the block', () => {
            mockBlock.referenceKeys.keys = jest.fn().mockReturnValue([]);
            mockBlock.referenceKeys.get = jest.fn().mockReturnValue([]);

            const result = BlockUtils.getDeviceFromBlock(mockBlock);
            expect(result).toBeUndefined();
        });
    });
});
