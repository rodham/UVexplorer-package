import { Device, isDevice, isNetworkSummary, NetworkSummary } from './uvexplorer-model';

export interface ListNetworksMessage {
    action: 'listNetworks';
    network_summaries: string;
}

export function isListNetworksMessage(message: unknown): message is ListNetworksMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        message.action === 'listNetworks' &&
        'network_summaries' in message &&
        typeof message.network_summaries === 'string'
    );
}

export function listNetworksMessageToNetworkSummaries(message: ListNetworksMessage): NetworkSummary[] {
    const networkSummaries: unknown = JSON.parse(message.network_summaries);
    if (Array.isArray(networkSummaries) && networkSummaries.every(isNetworkSummary)) {
        return networkSummaries;
    }
    throw new Error('Could not parse network summaries from message.');
}

export interface LoadNetworkMessage {
    action: 'loadNetwork';
    name: string;
    network_guid: string;
}

export function isLoadNetworkMessage(message: unknown): message is LoadNetworkMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        'name' in message &&
        typeof message.name === 'string' &&
        message.action === 'loadNetwork' &&
        'network_guid' in message &&
        typeof message.network_guid === 'string'
    );
}

export interface SerializableDevicesMessage {
    action: string;
    devices: string;
}

export function isSerializableDevicesMessage(message: unknown): message is SerializableDevicesMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        'devices' in message &&
        typeof message.devices === 'string'
    );
}

export function devicesFromSerializableDevicesMessage(message: SerializableDevicesMessage) {
    const devices: unknown = JSON.parse(message.devices);
    if (Array.isArray(devices) && devices.every(isDevice)) {
        return devices;
    }
    throw new Error('Could not parse devices from message.');
}

export interface DevicesMessage {
    action: string;
    devices: Device[];
}

export function isDevicesMessage(message: unknown): message is DevicesMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        'devices' in message &&
        Array.isArray(message.devices) &&
        message.devices.every(isDevice)
    );
}

export interface GetConnectedDevicesMessage {
    action: 'getConnectedDevices';
    device_guids: string[];
}

export function isGetConnectedDevicesMessage(message: unknown): message is GetConnectedDevicesMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        message.action === 'getConnectedDevices' &&
        'device_guids' in message &&
        Array.isArray(message.device_guids) &&
        message.device_guids.every((d) => typeof d === 'string')
    );
}

export interface ListDevicesMessage extends SerializableDevicesMessage {
    action: 'listDevices';
    visibleConnectedDeviceGuids?: string;
}

export function isListDevicesMessage(message: unknown): message is ListDevicesMessage {
    return isSerializableDevicesMessage(message) && message.action === 'listDevices';
}

export function connDeviceGuidsFromListDevMsg(message: ListDevicesMessage): string[] {
    if (!message.visibleConnectedDeviceGuids) {
        return [];
    }
    const deviceGuids: unknown = JSON.parse(message.visibleConnectedDeviceGuids);
    if (Array.isArray(deviceGuids) && deviceGuids.every((guid): guid is string => typeof guid === 'string')) {
        return deviceGuids;
    }
    console.error('Error parsing device guid array in message: ', message);
    return [];
}

export interface SelectedDevicesMessage extends DevicesMessage {
    action: 'selectDevices';
    removeDevices?: string[];
}

export function isSelectedDevicesMessage(message: unknown): message is SelectedDevicesMessage {
    if (message && typeof message === 'object' && 'removeDevices' in message) {
        return (
            Array.isArray(message.removeDevices) &&
            message.removeDevices.every((d): d is string => typeof d === 'string') &&
            isDevicesMessage(message) &&
            message.action === 'selectDevices'
        );
    }
    return isDevicesMessage(message) && message.action === 'selectDevices';
}
