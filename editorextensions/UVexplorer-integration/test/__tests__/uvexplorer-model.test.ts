import * as helpers from './helpers';
import {
    isDeviceCategoryListResponse,
    isDeviceDetailsResponse,
    isInfoSetListResponse,
    isNetworkSummariesResponse,
    isNetworkSummary
} from 'model/uvexplorer-model';
import {
    isDevice,
    isDeviceListResponse
} from 'model/uvexplorer-devices-model';
import {
    isTopoMap
} from 'model/uvexplorer-topomap-model';

describe('UVexplorer model tests', () => {
    describe('isNetworkSummariesResponse tests', () => {
        it('should return true given a valid NetworkSummariesResponse parsed from a JSON string', () => {
            const mockResponse: unknown = JSON.parse(helpers.mockNetworkSummariesXHRResponse.responseText);
            expect(isNetworkSummariesResponse(mockResponse)).toBe(true);
        });
        it('should return true given empty network_summaries array', () => {
            expect(isNetworkSummariesResponse({ network_summaries: [] })).toBe(true);
        });
        it('should return false given empty', () => {
            expect(isNetworkSummariesResponse({})).toBe(false);
        });
        it('should return false given no network_summaries property', () => {
            expect(isNetworkSummariesResponse({ not_network_summaries: [] })).toBe(false);
        });
        it('should return false given network_summaries array with an empty network object', () => {
            expect(isNetworkSummariesResponse({ network_summaries: [{}] })).toBe(false);
        });
    });

    describe('isNetworkSummary tests', () => {
        it('should return true given a valid NetworkSummary', () => {
            expect(isNetworkSummary(helpers.mockNetworkSummary)).toBe(true);
        });
        it('should return false given an empty object', () => {
            expect(isNetworkSummary({})).toBe(false);
        });
        it('should return false given not a NetworkSummary', () => {
            expect(isNetworkSummary({ not_a_network_summary: 'test' })).toBe(false);
        });
    });

    describe('isDeviceListResponse tests', () => {
        it('should return true given a valid DeviceListResponse parsed from JSON', () => {
            const mockResponse: unknown = JSON.parse(helpers.mockDeviceListXHRResponse.responseText);
            expect(isDeviceListResponse(mockResponse)).toBe(true);
        });
        it('should return true given empty devices array', () => {
            expect(isDeviceListResponse({ devices: [] })).toBe(true);
        });
        it('should return false given empty', () => {
            expect(isDeviceListResponse({})).toBe(false);
        });
        it('should return false given no devices property', () => {
            expect(isDeviceListResponse({ not_devices: [] })).toBe(false);
        });
        it('should return false given devices with an empty device object', () => {
            expect(isDeviceListResponse({ devices: [{}] })).toBe(false);
        });
    });

    describe('isDevice tests', () => {
        it('should return true given a valid Device', () => {
            expect(isDevice(helpers.mockDevice)).toBe(true);
        });
        it('should return false given an empty object', () => {
            expect(isDevice({})).toBe(false);
        });
        it('should return false given not a Device', () => {
            expect(isDevice({ not_a_device: 'test' })).toBe(false);
        });
    });

    describe('isDeviceCategoryResponse tests', () => {
        it('should return true given a valid DeviceCategoryListResponse parsed from JSON', () => {
            const mockResponse: unknown = JSON.parse(helpers.mockDeviceCategoryListXHRResponse.responseText);
            expect(isDeviceCategoryListResponse(mockResponse)).toBe(true);
        });
        it('should return true given an empty device_categories array', () => {
            expect(isDeviceCategoryListResponse({ device_categories: [] })).toBe(true);
        });
        it('should return false given empty', () => {
            expect(isDeviceCategoryListResponse({})).toBe(false);
        });
        it('should return false given no device_categories property', () => {
            expect(isDeviceCategoryListResponse({ not_device_categories: [] })).toBe(false);
        });
        it('should return false given a device_categories array of not strings', () => {
            expect(isDeviceCategoryListResponse({ device_categories: [{}] })).toBe(false);
        });
    });

    describe('isDeviceDetailsResponse tests', () => {
        it('should return true given a valid DeviceDetailsResponse parsed from JSON', () => {
            const mockResponse: unknown = JSON.parse(helpers.mockDeviceDetailsXHRResponse.responseText);
            expect(isDeviceDetailsResponse(mockResponse)).toBe(true);
        });
        it('should return true given an empty infoSets array', () => {
            const mockResponse = {
                deviceGuid: 'guid',
                displayName: 'name',
                infoSets: []
            };
            expect(isDeviceDetailsResponse(mockResponse)).toBe(true);
        });
        it('should return false given empty', () => {
            expect(isDeviceDetailsResponse({})).toBe(false);
        });
        it('should return false given no infoSets property', () => {
            expect(isDeviceDetailsResponse({ not_infoSets: [] })).toBe(false);
        });
        it('should return false given a infoSets array of not DeviceDetailsInfoSets', () => {
            expect(isDeviceDetailsResponse({ infoSets: [{}] })).toBe(false);
        });
    });

    describe('isInfoSetListResponse tests', () => {
        it('should return true given a valid InfoSetListResponse parsed from JSON', () => {
            const mockResponse: unknown = JSON.parse(helpers.mockInfoSetListXHRResponse.responseText);
            expect(isInfoSetListResponse(mockResponse)).toBe(true);
        });
        it('should return true given an empty info_sets array', () => {
            expect(isInfoSetListResponse({ info_sets: [] })).toBe(true);
        });
        it('should return false given empty', () => {
            expect(isInfoSetListResponse({})).toBe(false);
        });
        it('should return false given no info_sets property', () => {
            expect(isInfoSetListResponse({ not_info_sets: [] })).toBe(false);
        });
        it('should return false given an info_sets array of not InfoSets', () => {
            expect(isInfoSetListResponse({ infoSets: [{}] })).toBe(false);
        });
    });

    describe('isTopoMap tests', () => {
        it('should return true given a valid TopoMap parsed from JSON', () => {
            const mockResponse: unknown = JSON.parse(helpers.mockTopoMapXHRResponse.responseText);
            expect(isTopoMap(mockResponse)).toBe(true);
        });
        it('should return false given empty', () => {
            expect(isInfoSetListResponse({})).toBe(false);
        });
        it('should return false given no correct properties', () => {
            expect(isInfoSetListResponse({ not_topo_map: 'test' })).toBe(false);
        });
    });
});
