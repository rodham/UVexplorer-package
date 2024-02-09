import { UVExplorerClient } from '../../src/uvexplorer-client';
import * as lucid from 'lucid-extension-sdk';
import * as model from '../../model/uvexplorer-model';
import * as helpers from './helpers';
import { TextXHRResponse } from 'lucid-extension-sdk';

jest.mock('lucid-extension-sdk');
jest.mock('../../model/uvexplorer-model');

beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
});

describe('UVexplorer client tests', () => {
    const isTextXHRResponseSpy = jest.spyOn(lucid, 'isTextXHRResponse').mockReturnValue(true);
    let mockClient: lucid.EditorClient;
    let client: UVExplorerClient;

    const createXHRResponse = (status: number, responseText = ''): TextXHRResponse => ({
        url: 'https://my-uvexplorer-server.com/test',
        status,
        headers: {},
        responseFormat: 'utf8',
        responseText: responseText,
    });

    beforeEach(() => {
        mockClient = new lucid.EditorClient();
        client = new UVExplorerClient(mockClient);
    });

    describe('openSession tests', () => {
        it('should successfully send open session request and return a string', async () => {
            const url = 'test';
            const apiKey = 'test';
            const mockResponse = createXHRResponse(200, 'success');

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

    describe('closeSession tests', () => {
        it('should successfully send close session request and return void', async () => {
            const url = 'test';
            const sessionGuid = 'test';
            const mockResponse = createXHRResponse(200, '');

            const xhrSpy = jest.spyOn(mockClient, 'xhr').mockResolvedValue(mockResponse);

            await expect(client.closeSession(url, sessionGuid)).resolves.toBeUndefined();
            expect(xhrSpy).toHaveBeenCalledWith({
                url: url + '/public/api/v1/session',
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionGuid}`
                },
                data: undefined
            });
        });
    });

    describe('listNetworks tests', () => {
        it('should successfully send ListNetworks request and return NetworkSummary[]', async () => {
            const url = 'test';
            const sessionGuid = 'test';
            const mockResponse = helpers.mockNetworkSummariesXHRResponse;

            const xhrSpy = jest.spyOn(mockClient, 'xhr').mockResolvedValue(mockResponse);
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
                JSON.parse(mockResponse.responseText)
            );
        });

        it('should error when list networks call does not return network summaries', async () => {
            const url = 'test';
            const sessionId = 'test';
            const mockResponse = createXHRResponse(200, '{"test":"test"}');

            jest.spyOn(mockClient, 'xhr').mockResolvedValue(mockResponse);
            jest.spyOn(model, 'isNetworkSummariesResponse').mockReturnValue(false);

            await expect(client.listNetworks(url, sessionId)).rejects.toThrow('Response was not a NetworkSummariesResponse.');
        });
    });

    // describe('loadNetwork tests', () => {});
    //
    // describe('unloadNetwork tests', () => {});
    //
    // describe('listDevices tests', () => {});
    //
    // describe('listDeviceCategories tests', () => {});
    //
    // describe('listDeviceInfoSets tests', () => {});
    //
    // describe('listDeviceDetails tests', () => {});
    //
    // describe('listConnectedDevices tests', () => {});
    //
    // describe('getTopoMap tests', () => {});

    describe('parseResponseJSON tests', () => {
        it('should parse valid JSON without errors', () => {
            const responseText = '{"key": "value"}';
            const result = client.parseResponseJSON(responseText);
            expect(result).toStrictEqual({ key: 'value' });
        });

        it('should throw a custom error for invalid JSON', () => {
            const responseText = 'invalidJSON';
            expect(() => client.parseResponseJSON(responseText)).toThrow('Error parsing response JSON:');
        });
    });


    describe('checkStatusCode tests', () => {
        it('handles status code 200', () => {
            const response = createXHRResponse(200);
            expect(() => (response)).not.toThrow();
        });

        it.each([
            [400, 'Bad Request.'],
            [401, 'Unauthorized.'],
            [404, 'Not Found.'],
            [409, 'Conflict.'],
            [422, 'Unprocessable Entity (a network has not been loaded).'],
        ])('throws error for status code %i', (statusCode, errorMessage) => {
            const response = createXHRResponse(statusCode);
            expect(() => client.checkStatusCode(response)).toThrow(errorMessage);
        });
    });
});
