import { Device } from './uvexplorer-model';

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

export interface ListConnectedDevicesMessage {
    action: 'listConnectedDevices';
    devices: Device[];
}

export function isListConnectedDevicesMessage(message: unknown): message is ListConnectedDevicesMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        message.action === 'listConnectedDevices' &&
        'devices' in message &&
        Array.isArray(message.devices) &&
        message.devices.every((d) => d instanceof Device)
    );
}
