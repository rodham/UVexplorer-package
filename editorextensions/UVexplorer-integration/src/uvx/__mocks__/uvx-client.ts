import { EditorClient, TextXHRResponse } from 'lucid-extension-sdk';
import { TopoMap } from 'model/bundle/code/dtos/topology/TopoMap';
import {
    ConnectedDevicesRequest,
    Device,
    DeviceListRequest,
    NetworkRequest,
    NetworkSummary,
    TopoMapRequest
} from 'model/uvexplorer-model';
import { mockDeviceList, mockDeviceList2, mockNetworkSummaryList } from 'mock_data/devices';

export class UVExplorerClient {
    constructor(private client: EditorClient) {}

    public openSession = async (): Promise<string> => {
        return new Promise<string>((resolve) => resolve('efbb4e65-bac3-43d4-98b5-4e8b1f6279f1'));
    };

    public closeSession = async (): Promise<void> => {
        return new Promise<void>((resolve) => resolve());
    };

    public listNetworks = async (_serverUrl: string, _sessionGuid: string): Promise<NetworkSummary[]> => {
        return new Promise<NetworkSummary[]>((resolve) => {
            resolve(mockNetworkSummaryList);
        });
    };

    public loadNetwork = async (
        _serverUrl: string,
        _sessionGuid: string,
        _networkRequest: NetworkRequest
    ): Promise<void> => {
        return new Promise<void>((resolve) => resolve());
    };

    public unloadNetwork = async (_serverUrl: string, _sessionGuid: string): Promise<void> => {
        return new Promise<void>((resolve) => resolve());
    };

    public listDevices = async (
        _serverUrl: string,
        _sessionGuid: string,
        _deviceListRequest: DeviceListRequest
    ): Promise<Device[]> => {
        return new Promise<Device[]>((resolve) => {
            resolve(mockDeviceList);
        });
    };

    public listConnectedDevices = async (
        _serverUrl: string,
        _sessionGuid: string,
        _connectedDevicesRequest: ConnectedDevicesRequest
    ): Promise<Device[]> => {
        return new Promise<Device[]>((resolve) => {
            resolve(mockDeviceList2);
        });
    };

    public getTopoMap = async (
        _serverUrl: string,
        _sessionGuid: string,
        _topoMapRequest: TopoMapRequest
    ): Promise<TopoMap> => {
        return new Promise<TopoMap>((resolve) => {
            // TODO: maybe make actual mock topo map sometime
            resolve({} as TopoMap);
        });
    };

    public sendXHRRequest = async (
        _url: string,
        _token: string,
        _method: string,
        _data?: string
    ): Promise<TextXHRResponse> => {
        return new Promise<TextXHRResponse>((resolve) => {
            resolve({ responseText: 'res' } as TextXHRResponse);
        });
    };
}
