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

/**
 * API Client for making requests to UvExplorerServer Rest API V1
 */
export class UVExplorerClient {
    private readonly basePath: string = '/public/api/v1';
    private apiKey?: string;
    private serverUrl?: string;
    private sessionGuid?: string;

    constructor(private client: EditorClient) {}

    /**
     * Retrieve the apiKey and serverUrl from the package settings
     */
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

    /**
     * POST /session
     * Opens a new session
     */
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

    /**
     * Return the current session guid
     */
    private async getSessionGuid(): Promise<string> {
        if (!this.sessionGuid) {
            await this.openSession();
        }
        if (!this.sessionGuid) {
            throw Error('Unable to get session guid');
        }
        return this.sessionGuid;
    }

    /**
     * DELETE /session
     * Closes the current session
     */
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
        } else {
            this.sessionGuid = undefined;
        }
    }

    /**
     * GET /network/list
     * Returns a list of the user's network summaries
     */
    public async listNetworks(): Promise<NetworkSummary[]> {
        console.log('listNetworks about to make call', this.sessionGuid);
        const sessionGuid = await this.getSessionGuid();
        console.log('retrieved session guid', sessionGuid);
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

    /**
     * POST /network/load
     * Loads a network for the current session
     * @param networkRequest
     */
    public async loadNetwork(networkRequest: NetworkRequest): Promise<void> {
        const sessionGuid = await this.getSessionGuid();
        if (!this.serverUrl || !this.sessionGuid) {
            throw Error('Unable to make loadNetwork request');
        }
        const url = this.serverUrl + this.basePath + '/network/load';
        const body = JSON.stringify(networkRequest);
        await this.sendXHRRequest(url, sessionGuid, 'POST', body);
    }

    /**
     * DELETE /network/unload
     * Unloads a network for the current session
     */
    public async unloadNetwork(): Promise<void> {
        const sessionGuid = await this.getSessionGuid();
        if (!this.serverUrl || !this.sessionGuid) {
            throw Error('Unable to make loadNetwork request');
        }
        const url = this.serverUrl + this.basePath + '/network/unload';
        await this.sendXHRRequest(url, sessionGuid, 'DELETE');
    }

    /**
     * POST /device/list
     * Returns a list of devices in the currently loaded network (for the current session)
     * @param deviceListRequest
     */
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

    /**
     * GET /device/category/list
     * Returns the set of device categories present in the currently loaded network (for the current session)
     */
    public async listDeviceCategories(): Promise<string[]> {
        const sessionGuid = await this.getSessionGuid();
        if (!this.serverUrl || !this.sessionGuid) {
            throw Error('Unable to make loadNetwork request');
        }
        const url = this.serverUrl + this.basePath + '/device/category/list';
        const response = await this.sendXHRRequest(url, sessionGuid, 'GET');
        const deviceCategoryResponse: unknown = this.parseResponseJSON(response.responseText);
        if (isDeviceCategoryListResponse(deviceCategoryResponse)) {
            return deviceCategoryResponse.device_categories;
        } else {
            throw new Error('Response was not a DeviceCategoryListResponse.');
        }
    }

    /**
     * GET /device/infoset/list
     * Returns the set of infosets present in the currently loaded network (for the current session)
     */
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

    /**
     * GET /device/details/${deviceGuid}
     * Returns a device details response for the requested device
     * @param deviceGuid
     */
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

    /**
     * POST /device/connected
     * Returns the list of devices connected to the requested device
     * @param connectedDevicesRequest
     */
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

    /**
     * POST /device/topomap
     * Returns the requested TopoMap
     * @param topoMapRequest
     */
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

    /**
     * Performs an XHR request with bearer token authentication
     * @param url full request url
     * @param token bearer token (either API key or session GUID)
     * @param method request method
     * @param data request body (optional)
     */
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
