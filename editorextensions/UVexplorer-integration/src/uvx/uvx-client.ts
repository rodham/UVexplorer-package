import { EditorClient, isTextXHRResponse, XHRRequest, XHRResponse } from 'lucid-extension-sdk';
import {
    ConnectedDevicesRequest,
    Device,
    DeviceCategoryListResponse,
    DeviceDetailsResponse,
    DeviceListRequest,
    DeviceListResponse,
    InfoSet,
    InfoSetListResponse,
    NetworkRequest,
    NetworkSummariesResponse,
    NetworkSummary,
    TopoMapRequest
} from '@model/uvexplorer-model';
import { TopoMap } from '@model/bundle/code/dtos/topology/TopoMap';

export class UVExplorerClient {
    private readonly basePath: string = '/public/api/v1';

    constructor(private client: EditorClient) {}

    public async openSession(serverUrl: string, apiKey: string): Promise<string> {
        const url = serverUrl + this.basePath + '/session';
        const response = await this.sendXHRRequest(url, apiKey, 'POST');
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
            const networkSummariesResponse = JSON.parse(response.responseText) as NetworkSummariesResponse;
            return networkSummariesResponse.network_summaries;
        }
        return [];
    }

    public async loadNetwork(serverUrl: string, sessionGuid: string, networkRequest: NetworkRequest): Promise<void> {
        const url = serverUrl + this.basePath + '/network/load';
        const body = JSON.stringify(networkRequest);
        await this.sendXHRRequest(url, sessionGuid, 'POST', body);
    }

    public async unloadNetwork(serverUrl: string, sessionGuid: string): Promise<void> {
        const url = serverUrl + this.basePath + '/network/unload';
        await this.sendXHRRequest(url, sessionGuid, 'DELETE');
    }

    public async listDevices(
        serverUrl: string,
        sessionGuid: string,
        deviceListRequest: DeviceListRequest
    ): Promise<Device[]> {
        const url = serverUrl + this.basePath + '/device/list';
        const data = JSON.stringify(deviceListRequest);
        const response = await this.sendXHRRequest(url, sessionGuid, 'POST', data);
        if (isTextXHRResponse(response)) {
            const deviceListResponse = JSON.parse(response.responseText) as DeviceListResponse;
            return deviceListResponse.devices;
        }
        return [];
    }

    public async listDeviceCategories(serverUrl: string, sessionGuid: string): Promise<string[]> {
        const url = serverUrl + this.basePath + '/device/category/list';
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        if (isTextXHRResponse(response)) {
            const deviceCategoryListResponse = JSON.parse(response.responseText) as DeviceCategoryListResponse;
            return deviceCategoryListResponse.device_categories;
        }
        return [];
    }

    public async listDeviceInfoSets(serverUrl: string, sessionGuid: string): Promise<InfoSet[]> {
        const url = serverUrl + this.basePath + '/device/infoset/list';
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        if (isTextXHRResponse(response)) {
            const infoSetListResponse = JSON.parse(response.responseText) as InfoSetListResponse;
            return infoSetListResponse.info_sets;
        }
        return [];
    }

    public async listDeviceDetails(
        serverUrl: string,
        sessionGuid: string,
        deviceGuid: string
    ): Promise<DeviceDetailsResponse | undefined> {
        const url = serverUrl + this.basePath + `/device/details/${deviceGuid}`;
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        if (isTextXHRResponse(response)) {
            return JSON.parse(response.responseText) as DeviceDetailsResponse;
        }
        return undefined;
    }

    public async listConnectedDevices(
        serverUrl: string,
        sessionGuid: string,
        connectedDevicesRequest: ConnectedDevicesRequest
    ): Promise<Device[]> {
        const url = serverUrl + this.basePath + `/device/connected`;
        const body = JSON.stringify(connectedDevicesRequest);
        const response = await this.sendXHRRequest(url, sessionGuid, 'POST', body);
        if (isTextXHRResponse(response)) {
            const deviceListResponse = JSON.parse(response.responseText) as DeviceListResponse;
            return deviceListResponse.devices;
        }
        return [];
    }

    public async getTopoMap(
        serverUrl: string,
        sessionGuid: string,
        topoMapRequest: TopoMapRequest
    ): Promise<TopoMap | undefined> {
        const url = serverUrl + this.basePath + `/device/topomap`;
        const body = JSON.stringify(topoMapRequest);
        const response = await this.sendXHRRequest(url, sessionGuid, 'POST', body);
        if (isTextXHRResponse(response)) {
            return JSON.parse(response.responseText) as TopoMap;
        }
        return undefined;
    }

    private async sendXHRRequest(url: string, token: string, method: string, data?: string): Promise<XHRResponse> {
        try {
            const request: XHRRequest = {
                url: url,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
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
