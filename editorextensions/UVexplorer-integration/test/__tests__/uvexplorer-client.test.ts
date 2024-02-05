import * as uvexplorerModel from '../../model/uvexplorer-model';
import { UVExplorerClient } from '../../src/uvexplorer-client';
import * as lucid from 'lucid-extension-sdk';

jest.mock('lucid-extension-sdk');
jest.mock('../../model/uvexplorer-model');

beforeEach(() => {
    jest.resetModules();
});

describe('UVexplorer client successful tests', () => {
    const isTextXHRResponseSpy = jest.spyOn(lucid, 'isTextXHRResponse').mockReturnValue(true);
    const isNetworkSummariesResponseSpy = jest
        .spyOn(uvexplorerModel, 'isNetworkSummariesResponse')
        .mockReturnValue(true);
    let mockClient: lucid.EditorClient;
    let mockResponse: lucid.TextXHRResponse;
    let client: UVExplorerClient;

    beforeEach(() => {
        mockClient = new lucid.EditorClient();
        client = new UVExplorerClient(mockClient);
    });

    it('should successfully send and receive session start call', async () => {
        const url = 'test';
        const key = 'key';
        mockResponse = {
            responseText: 'Success',
            responseFormat: 'utf8',
            url: 'test',
            status: 200,
            headers: {}
        };
        const xhrSpy = jest.spyOn(mockClient, 'xhr').mockResolvedValue(mockResponse);

        await expect(client.openSession(url, key)).resolves.toBe(mockResponse.responseText);
        expect(isTextXHRResponseSpy).toHaveBeenCalledWith(mockResponse);
        expect(xhrSpy).toHaveBeenCalledWith({
            url: url + '/public/api/v1/session',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${key}`
            },
            data: undefined
        });
    });

    it('should successfully send and return list networks call', async () => {
        const url = 'test';
        const sessionId = '1234567890';
        const testData = {
            network_summaries: ['summary1', 'summary2', 'summary3']
        };
        mockResponse = {
            responseText: JSON.stringify(testData),
            responseFormat: 'utf8',
            url: 'testUrl',
            status: 200,
            headers: {}
        };
        const xhrSpy = jest.spyOn(mockClient, 'xhr').mockResolvedValue(mockResponse);

        await expect(client.listNetworks(url, sessionId)).resolves.toStrictEqual(testData.network_summaries);
        expect(isNetworkSummariesResponseSpy).toHaveBeenCalledWith(testData);
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
