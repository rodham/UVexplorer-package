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
}

export function isListDevicesMessage(message: unknown): message is ListDevicesMessage {
    return isSerializableDevicesMessage(message) && message.action === 'listDevices';
}

export interface SelectedDevicesMessage extends DevicesMessage {
    action: 'selectDevices';
}

export function isSelectedDevicesMessage(message: unknown): message is SelectedDevicesMessage {
    return isDevicesMessage(message) && message.action === 'selectDevices';
}

// export interface AddDevicesMessage extends DevicesMessage {
//     action: 'addDevices';
// }
//
// export function isAddDevicesMessage(message: unknown): message is AddDevicesMessage {
//     return isDevicesMessage(message) && message.action === 'addDevices';
// }
