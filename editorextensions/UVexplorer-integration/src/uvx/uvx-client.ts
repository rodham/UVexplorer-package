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
    private apiKey?: string;
    private serverUrl?: string;
    private sessionGuid?: string;
    private static instance: UVExplorerClient;

    constructor(private client: EditorClient) {}

    static getInstance(client: EditorClient) {
        if (!UVExplorerClient.instance) {
            UVExplorerClient.instance = new UVExplorerClient(client);
        }
        return UVExplorerClient.instance;
    }

    private async getCredentials() {
        const settings = await this.client.getPackageSettings();
        const apiKey = settings.get('apiKey');
        const serverUrl = settings.get('serverUrl');

        if (typeof apiKey !== 'string' || typeof serverUrl !== 'string') {
            throw Error('Unable to get package settings for uvx client');
        }

        this.apiKey = apiKey;
        this.serverUrl = serverUrl;
    }

    private async openSession(): Promise<void> {
        if (!this.serverUrl || !this.apiKey) {
            await this.getCredentials();
        }
        if (!this.serverUrl || !this.apiKey) {
            throw Error('Unable to open session without package settings');
        }
        const url = this.serverUrl + this.basePath + '/session';
        const response = await this.sendXHRRequest(url, this.apiKey, 'POST');
        if (!response.responseText) {
            throw Error('Error occurred while opening session');
        }
        this.sessionGuid = response.responseText;
    }

    private async getSessionGuid(): Promise<string> {
        if (!this.sessionGuid) {
            await this.openSession();
        }
        if (!this.sessionGuid) {
            throw Error('Unable to get session guid');
        }
        return this.sessionGuid;
    }

    public async closeSession(): Promise<void> {
        if (!this.sessionGuid) {
            console.log('No session open');
            return;
        }
        if (!this.serverUrl) {
            console.error('No server url set');
            return;
        }
        const url = this.serverUrl + this.basePath + '/session';
        const response = await this.sendXHRRequest(url, this.sessionGuid, 'DELETE');
        if (response.status !== 200) {
            throw new Error('Session close was unsuccessful.');
        }
    }

    public async listNetworks(): Promise<NetworkSummary[]> {
        const sessionGuid = await this.getSessionGuid();
        if (!this.serverUrl || !this.sessionGuid) {
            throw Error('Unable to make listNetworks request');
        }
        const url = this.serverUrl + this.basePath + '/network/list';
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        const networkSummariesResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isNetworkSummariesResponse(networkSummariesResponse)) {
            return networkSummariesResponse.network_summaries;
        } else {
            throw new Error('Response was not a NetworkSummariesResponse.');
        }
    }

    public async loadNetwork(networkRequest: NetworkRequest): Promise<void> {
        const sessionGuid = await this.getSessionGuid();
        if (!this.serverUrl || !this.sessionGuid) {
            throw Error('Unable to make loadNetwork request');
        }
        const url = this.serverUrl + this.basePath + '/network/load';
        const body = JSON.stringify(networkRequest);
        await this.sendXHRRequest(url, sessionGuid, 'POST', body);
    }

    public async unloadNetwork(): Promise<void> {
        const sessionGuid = await this.getSessionGuid();
        if (!this.serverUrl || !this.sessionGuid) {
            throw Error('Unable to make loadNetwork request');
        }
        const url = this.serverUrl + this.basePath + '/network/unload';
        await this.sendXHRRequest(url, sessionGuid, 'DELETE');
    }

    public async listDevices(deviceListRequest: DeviceListRequest): Promise<Device[]> {
        const sessionGuid = await this.getSessionGuid();
        if (!this.serverUrl || !this.sessionGuid) {
            throw Error('Unable to make loadNetwork request');
        }
        const url = this.serverUrl + this.basePath + '/device/list';
        const data = JSON.stringify(deviceListRequest);
        const response = await this.sendXHRRequest(url, sessionGuid, 'POST', data);
        const deviceListResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isDeviceListResponse(deviceListResponse)) {
            return deviceListResponse.devices;
        } else {
            throw new Error('Response was not a DeviceListResponse.');
        }
    }

    public async listDeviceCategories(): Promise<string[]> {
        const sessionGuid = await this.getSessionGuid();
        if (!this.serverUrl || !this.sessionGuid) {
            throw Error('Unable to make loadNetwork request');
        }
        const url = this.serverUrl + this.basePath + '/device/device-type.ts/list';
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        const deviceCategoryResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isDeviceCategoryListResponse(deviceCategoryResponse)) {
            return deviceCategoryResponse.device_categories;
        } else {
            throw new Error('Response was not a DeviceCategoryListResponse.');
        }
    }

    public async listDeviceInfoSets(): Promise<InfoSet[]> {
        const sessionGuid = await this.getSessionGuid();
        if (!this.serverUrl || !this.sessionGuid) {
            throw Error('Unable to make loadNetwork request');
        }
        const url = this.serverUrl + this.basePath + '/device/infoset/list';
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        const infoSetListResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isInfoSetListResponse(infoSetListResponse)) {
            return infoSetListResponse.info_sets;
        } else {
            throw new Error('Response was not an InfoSetListResponse.');
        }
    }

    public async listDeviceDetails(deviceGuid: string): Promise<DeviceDetailsResponse | undefined> {
        const sessionGuid = await this.getSessionGuid();
        if (!this.serverUrl || !this.sessionGuid) {
            throw Error('Unable to make loadNetwork request');
        }
        const url = this.serverUrl + this.basePath + `/device/details/${deviceGuid}`;
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        const deviceDetailsResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isDeviceDetailsResponse(deviceDetailsResponse)) {
            return deviceDetailsResponse;
        } else {
            throw new Error('Response was not a DeviceDetailsResponse.');
        }
    }

    public async listConnectedDevices(connectedDevicesRequest: ConnectedDevicesRequest): Promise<Device[]> {
        const sessionGuid = await this.getSessionGuid();
        if (!this.serverUrl || !this.sessionGuid) {
            throw Error('Unable to make loadNetwork request');
        }
        const url = this.serverUrl + this.basePath + `/device/connected`;
        const body = JSON.stringify(connectedDevicesRequest);
        const response = await this.sendXHRRequest(url, sessionGuid, 'POST', body);
        const deviceListResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isDeviceListResponse(deviceListResponse)) {
            return deviceListResponse.devices;
        } else {
            throw new Error('Response was not a DeviceListResponse.');
        }
    }

    public async getTopoMap(topoMapRequest: TopoMapRequest): Promise<TopoMap> {
        const sessionGuid = await this.getSessionGuid();
        if (!this.serverUrl || !this.sessionGuid) {
            throw Error('Unable to make loadNetwork request');
        }
        const url = this.serverUrl + this.basePath + `/device/topomap`;
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
