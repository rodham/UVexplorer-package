import { UVExplorerClient } from '../../src/uvexplorer-client';
import * as lucid from 'lucid-extension-sdk';
import * as model from '../../model/uvexplorer-model';
import * as helpers from './helpers';

jest.mock('lucid-extension-sdk');
jest.mock('../../model/uvexplorer-model');

beforeEach(() => {
    jest.resetModules();
});

describe('UVexplorer client tests', () => {
    const isTextXHRResponseSpy = jest.spyOn(lucid, 'isTextXHRResponse').mockReturnValue(true);
    let mockClient: lucid.EditorClient;
    let mockResponse: lucid.TextXHRResponse;
    let client: UVExplorerClient;

    beforeEach(() => {
        mockClient = new lucid.EditorClient();
        client = new UVExplorerClient(mockClient);
    });

    describe('openSession tests', () => {
        it('should successfully send and receive session start call', async () => {
            const url = 'test';
            const apiKey = 'test';
            mockResponse = {
                responseText: 'Success',
                responseFormat: 'utf8',
                url: 'test',
                status: 200,
                headers: {}
            };
            const xhrSpy = jest.spyOn(mockClient, 'xhr').mockResolvedValue(mockResponse);

            await expect(client.openSession(url, apiKey)).resolves.toBe(mockResponse.responseText);
            expect(isTextXHRResponseSpy).toHaveBeenCalledWith(mockResponse);
            expect(xhrSpy).toHaveBeenCalledWith({
                url: url + '/public/api/v1/session',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`
                },
                data: undefined
            });
        });
    });

    describe('closeSession tests', () => {});

    describe('listNetworks tests', () => {
        it('should successfully send ListNetworks request and return NetworkSummary[]', async () => {
            const url = 'test';
            const sessionGuid = 'test';
            const xhrSpy = jest.spyOn(mockClient, 'xhr').mockResolvedValue(helpers.mockNetworkSummariesXHRResponse);
            const isNetworkSummariesResponseSpy = jest.spyOn(model, 'isNetworkSummariesResponse').mockReturnValue(true);

            await expect(client.listNetworks(url, sessionGuid)).resolves.toStrictEqual(
                helpers.mockNetworkSummariesResponse.network_summaries
            );
            expect(xhrSpy).toHaveBeenCalledWith({
                url: url + '/public/api/v1/network/list',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionGuid}`
                },
                data: undefined
            });
            expect(isNetworkSummariesResponseSpy).toHaveBeenCalledWith(
                JSON.parse(helpers.mockNetworkSummariesXHRResponse.responseText)
            );
        });

        it('should error when list networks call does not return network summaries', async () => {
            const url = 'test';
            const sessionId = '1234567890';
            const testData = {
                error: 'not found'
            };
            mockResponse = {
                responseText: JSON.stringify(testData),
                responseFormat: 'utf8',
                url: 'testUrl',
                status: 404,
                headers: {}
            };
            const xhrSpy = jest.spyOn(mockClient, 'xhr').mockResolvedValue(mockResponse);

            await client.listNetworks(url, sessionId);
            expect(xhrSpy).toHaveBeenCalledWith({
                url: url + '/public/api/v1/network/list',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionId}`
                },
                data: undefined
            });
        });
    });

    describe('loadNetwork tests', () => {});

    describe('unloadNetwork tests', () => {});

    describe('listDevices tests', () => {});

    describe('listDeviceCategories tests', () => {});

    describe('listDeviceInfoSets tests', () => {});

    describe('listDeviceDetails tests', () => {});

    describe('listConnectedDevices tests', () => {});

    describe('getTopoMap tests', () => {});
});
