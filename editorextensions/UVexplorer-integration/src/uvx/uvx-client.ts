import { EditorClient, isTextXHRResponse, TextXHRResponse, XHRRequest, XHRResponse } from 'lucid-extension-sdk';
import { isNetworkSummariesResponse, NetworkRequest, NetworkSummary } from 'model/uvx/network';
import {
    ConnectedDevicesRequest,
    Device,
    DeviceDetailsResponse,
    DeviceListRequest,
    InfoSet,
    isDeviceCategoryListResponse,
    isDeviceDetailsResponse,
    isDeviceListResponse,
    isInfoSetListResponse
} from 'model/uvx/device';
import { TopoMapRequest, isTopoMap, TopoMap } from 'model/uvx/topo-map';

export class UVExplorerClient {
    private readonly basePath: string = '/public/api/v1';

    constructor(private client: EditorClient) {}

    public async openSession(serverUrl: string, apiKey: string): Promise<string> {
        const url = serverUrl + this.basePath + '/session';
        const response = await this.sendXHRRequest(url, apiKey, 'POST');
        return response.responseText;
    }

    public async closeSession(serverUrl: string, sessionGuid: string): Promise<void> {
        const url = serverUrl + this.basePath + '/session';
        const response = await this.sendXHRRequest(url, sessionGuid, 'DELETE');
        if (response.status !== 200) {
            throw new Error('Session close was unsuccessful.');
        }
    }

    public async listNetworks(serverUrl: string, sessionGuid: string): Promise<NetworkSummary[]> {
        const url = serverUrl + this.basePath + '/network/list';
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        const networkSummariesResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isNetworkSummariesResponse(networkSummariesResponse)) {
            return networkSummariesResponse.network_summaries;
        } else {
            throw new Error('Response was not a NetworkSummariesResponse.');
        }
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
        const deviceListResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isDeviceListResponse(deviceListResponse)) {
            return deviceListResponse.devices;
        } else {
            throw new Error('Response was not a DeviceListResponse.');
        }
    }

    public async listDeviceCategories(serverUrl: string, sessionGuid: string): Promise<string[]> {
        const url = serverUrl + this.basePath + '/device/device-type.ts/list';
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        const deviceCategoryResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isDeviceCategoryListResponse(deviceCategoryResponse)) {
            return deviceCategoryResponse.device_categories;
        } else {
            throw new Error('Response was not a DeviceCategoryListResponse.');
        }
    }

    public async listDeviceInfoSets(serverUrl: string, sessionGuid: string): Promise<InfoSet[]> {
        const url = serverUrl + this.basePath + '/device/infoset/list';
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        const infoSetListResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isInfoSetListResponse(infoSetListResponse)) {
            return infoSetListResponse.info_sets;
        } else {
            throw new Error('Response was not an InfoSetListResponse.');
        }
    }

    public async listDeviceDetails(
        serverUrl: string,
        sessionGuid: string,
        deviceGuid: string
    ): Promise<DeviceDetailsResponse | undefined> {
        const url = serverUrl + this.basePath + `/device/details/${deviceGuid}`;
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        const deviceDetailsResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isDeviceDetailsResponse(deviceDetailsResponse)) {
            return deviceDetailsResponse;
        } else {
            throw new Error('Response was not a DeviceDetailsResponse.');
        }
    }

    public async listConnectedDevices(
        serverUrl: string,
        sessionGuid: string,
        connectedDevicesRequest: ConnectedDevicesRequest
    ): Promise<Device[]> {
        const url = serverUrl + this.basePath + `/device/connected`;
        const body = JSON.stringify(connectedDevicesRequest);
        const response = await this.sendXHRRequest(url, sessionGuid, 'POST', body);
        const deviceListResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isDeviceListResponse(deviceListResponse)) {
            return deviceListResponse.devices;
        } else {
            throw new Error('Response was not a DeviceListResponse.');
        }
    }

    public async getTopoMap(serverUrl: string, sessionGuid: string, topoMapRequest: TopoMapRequest): Promise<TopoMap> {
        const url = serverUrl + this.basePath + `/device/topomap`;
        const body = JSON.stringify(topoMapRequest);
        const response = await this.sendXHRRequest(url, sessionGuid, 'POST', body);
        const topoMap: unknown = this.parseResponseJSON(response.responseText);
        if (isTopoMap(topoMap)) {
            return topoMap;
        } else {
            throw new Error('Response was not a TopoMap.');
        }
    }

    public async sendXHRRequest(url: string, token: string, method: string, data?: string): Promise<TextXHRResponse> {
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
            const response = await this.client.xhr(request);
            this.checkStatusCode(response);
            if (isTextXHRResponse(response)) {
                return response;
            }
            throw Error('Response was not a TextXHRResponse.');
        } catch (error) {
            console.log('Error:', error);
            throw error;
        }
    }

    public parseResponseJSON(responseText: string): unknown {
        try {
            return JSON.parse(responseText);
        } catch (e) {
            throw new Error('Error parsing response JSON: ' + e);
        }
    }

    public checkStatusCode(response: XHRResponse) {
        switch (response.status) {
            case 200: {
                break;
            }
            case 400: {
                throw new Error('Bad Request.');
            }
            case 401: {
                throw new Error('Unauthorized.');
            }
            case 404: {
                throw new Error('Not Found.');
            }
            case 409: {
                throw new Error('Conflict.');
            }
            case 422: {
                throw new Error('Unprocessable Entity (a network has not been loaded).');
            }
        }
    }
}
