import { EditorClient, isTextXHRResponse, XHRRequest, XHRResponse } from 'lucid-extension-sdk';
import {
    ConnectedDevicesRequest,
    Device,
    DeviceDetailsResponse,
    DeviceListRequest,
    InfoSet,
    isDeviceCategoryListResponse,
    isDeviceDetailsResponse,
    isDeviceListResponse,
    isInfoSetListResponse,
    isNetworkSummariesResponse,
    NetworkRequest,
    NetworkSummary,
    TopoMapRequest
} from '../model/uvexplorer-model';
import { isTopoMap, TopoMap } from '../model/bundle/code/dtos/topology/TopoMap';

export class UVExplorerClient {
    private readonly basePath: string = '/public/api/v1';

    constructor(private client: EditorClient) {}

    public async openSession(serverUrl: string, apiKey: string): Promise<string> {
        const url = serverUrl + this.basePath + '/session';
        const response = await this.sendXHRRequest(url, apiKey, 'POST');
        if (isTextXHRResponse(response)) {
            return response.responseText;
        } else {
            throw new Error('Response was not a TextXHRResponse.');
        }
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
        if (isTextXHRResponse(response)) {
            const networkSummariesResponse: unknown = JSON.parse(response.responseText);
            if (isNetworkSummariesResponse(networkSummariesResponse)) {
                return networkSummariesResponse.network_summaries;
            } else {
                throw new Error('Response was not a NetworkSummariesResponse');
            }
        } else {
            throw new Error('Response was not a TextXHRResponse.');
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
        if (isTextXHRResponse(response)) {
            if (isDeviceListResponse(response)) {
                return response.devices;
            } else {
                throw new Error('Response was not a DeviceListResponse.');
            }
        } else {
            throw new Error('Response was not a TextXHRResponse.');
        }
    }

    public async listDeviceCategories(serverUrl: string, sessionGuid: string): Promise<string[]> {
        const url = serverUrl + this.basePath + '/device/category/list';
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        if (isTextXHRResponse(response)) {
            if (isDeviceCategoryListResponse(response)) {
                return response.device_categories;
            } else {
                throw new Error('Response was not a DeviceCategoryListResponse.');
            }
        } else {
            throw new Error('Response was not a TextXHRResponse.');
        }
    }

    public async listDeviceInfoSets(serverUrl: string, sessionGuid: string): Promise<InfoSet[]> {
        const url = serverUrl + this.basePath + '/device/infoset/list';
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        if (isTextXHRResponse(response)) {
            if (isInfoSetListResponse(response)) {
                return response.info_sets;
            } else {
                throw new Error('Response was not an InfoSetListResponse.');
            }
        } else {
            throw new Error('Response was not a TextXHRResponse.');
        }
    }

    public async listDeviceDetails(
        serverUrl: string,
        sessionGuid: string,
        deviceGuid: string
    ): Promise<DeviceDetailsResponse | undefined> {
        const url = serverUrl + this.basePath + `/device/details/${deviceGuid}`;
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        if (isTextXHRResponse(response)) {
            if (isDeviceDetailsResponse(response)) {
                return response;
            } else {
                throw new Error('Response was not a DeviceDetailsResponse.');
            }
        } else {
            throw new Error('Response was not a TextXHRResponse.');
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
        if (isTextXHRResponse(response)) {
            if (isDeviceListResponse(response)) {
                return response.devices;
            } else {
                throw new Error('Response was not a DeviceListResponse.');
            }
        } else {
            throw new Error('Response was not a TextXHRResponse.');
        }
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
            if (isTopoMap(response)) {
                return response;
            } else {
                throw new Error('Response was not a TopoMap.');
            }
        } else {
            throw new Error('Response was not a TextXHRResponse.');
        }
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
            const response = await this.client.xhr(request);
            this.checkStatusCode(response);
            return response;
        } catch (error) {
            console.log('Error:', error);
            throw error;
        }
    }

    private checkStatusCode(response: XHRResponse) {
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
