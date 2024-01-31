import {EditorClient, isTextXHRResponse, XHRRequest, XHRResponse} from "lucid-extension-sdk";
import {
    Device,
    DeviceListRequest,
    DeviceListResponse,
    NetworkRequest,
    NetworkSummariesResponse,
    NetworkSummary
} from "../model/uvexplorer-model";

export class UVExplorerClient {
    private readonly basePath: string = '/public/api/v1';

    constructor(private client: EditorClient) { }

    public async openSession(serverUrl: string, apiKey: string): Promise<string> {
        const url = serverUrl + this.basePath + '/session';
        const response = await this.sendXHRRequest(url, apiKey,'POST');
        if (isTextXHRResponse(response)) {
            return response.responseText;
        }
        return '';
    }

    public async closeSession(serverUrl: string, sessionGuid: string): Promise<void> {
        const url = serverUrl + this.basePath + '/session';
        await this.sendXHRRequest(url, sessionGuid, 'DELETE');
    }

    public async listNetworks(serverUrl: string, sessionGuid: string): Promise<NetworkSummary[]> {
        const url = serverUrl + this.basePath + '/network/list';
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        if (isTextXHRResponse(response)) {
            //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const networkSummariesResponse: NetworkSummariesResponse = JSON.parse(response.responseText)
            return networkSummariesResponse.network_summaries;
        }
        return [];
    }

    public async loadNetwork(serverUrl: string, sessionGuid: string, networkRequest: NetworkRequest): Promise<void> {
        const url = serverUrl + this.basePath + '/network/load';
        const data = JSON.stringify(networkRequest);
        await this.sendXHRRequest(url, sessionGuid, 'POST', data);
    }

    public async unloadNetwork(serverUrl: string, sessionGuid: string): Promise<void> {
        const url = serverUrl + this.basePath + '/network/unload';
        await this.sendXHRRequest(url, sessionGuid, 'DELETE');
    }

    public async listDevices(serverUrl: string, sessionGuid: string, deviceListRequest: DeviceListRequest): Promise<Device[]> {
        const url = serverUrl + this.basePath + '/device/list';
        const data = JSON.stringify(deviceListRequest)
        const response = await this.sendXHRRequest(url, sessionGuid, 'POST', data)
        if (isTextXHRResponse(response)) {
            //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const deviceListResponse: DeviceListResponse = JSON.parse(response.responseText)
            return deviceListResponse.devices;
        }
        return [];
    }

    private async sendXHRRequest(url: string, token: string, method: string, data?: string): Promise<XHRResponse> {
        try {
            const request: XHRRequest = {
                url: url,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                data: data
            };
            return await this.client.xhr(request);
        } catch (error) {
            console.log('Error:', error);
            throw error;
        }
    }
}
