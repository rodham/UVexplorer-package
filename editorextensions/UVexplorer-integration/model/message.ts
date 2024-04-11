import { isNetworkSummary, NetworkSummary } from './uvx/network';
import {
    Device,
    DeviceDetailsResponse,
    DeviceFilter,
    isDevice,
    isDeviceDetailsResponse,
    isDeviceFilter
} from 'model/uvx/device';
import { isString } from 'lucid-extension-sdk';
import {
    DrawSettings,
    ImageSettings,
    isDrawSettings,
    isImageSettings,
    isLayoutSettings,
    LayoutSettings
} from './uvx/topo-map';
import { DisplayEdge, isDisplayEdge } from 'model/uvx/display-edge';

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

/**
 * Parses and returns newtorkSummaries from given listNetworks message.
 * @param message ListNetworksMessage
 * @returns NetworkSummary[]
 */
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

/**
 * Parses and returns devices from given devices message.
 * @param message SerializableDevicesMessage
 * @returns Device[]
 */
export function devicesFromSerializableDevicesMessage(message: SerializableDevicesMessage): Device[] {
    const devices: unknown = JSON.parse(message.devices);
    if (Array.isArray(devices) && devices.every(isDevice)) {
        return devices;
    }
    throw new Error('Could not parse devices from message.');
}

export interface DevicesMessage {
    action: string;
    devices: string[];
}

export function isDevicesMessage(message: unknown): message is DevicesMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        'devices' in message &&
        Array.isArray(message.devices) &&
        message.devices.every(isString)
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
    visibleConnectedDeviceGuids?: string; // Why string and not string[]?
    networkName: string;
    backButton: boolean;
}

export function isListDevicesMessage(message: unknown): message is ListDevicesMessage {
    return (
        isSerializableDevicesMessage(message) &&
        message.action === 'listDevices' &&
        'visibleConnectedDeviceGuids' in message &&
        typeof message.visibleConnectedDeviceGuids === 'string' &&
        'networkName' in message &&
        typeof message.networkName === 'string' &&
        'backButton' in message &&
        typeof message.backButton === 'boolean'
    );
}

/**
 * Parses and returns connected device guids from given listDevices message.
 * @param message ListDevicesMessage
 * @returns string[]
 */
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

export interface DeviceDetailsMessage {
    action: 'viewDeviceDetails';
    deviceDetails: string;
    device: string;
}

export function isDeviceDetailsMessage(message: unknown): message is DeviceDetailsMessage {
    return (
        message !== null &&
        typeof message === 'object' &&
        'action' in message &&
        typeof message.action === 'string' &&
        message.action === 'viewDeviceDetails' &&
        'deviceDetails' in message &&
        typeof message.deviceDetails === 'string' &&
        'device' in message &&
        typeof message.device === 'string'
    );
}

/**
 * Parses and returns device details from given device details message.
 * @param message DeviceDetailsMessage
 * @returns DeviceDetailsResponse
 */
export function deviceDetailsFromMessage(message: DeviceDetailsMessage): DeviceDetailsResponse {
    const deviceDetails: unknown = JSON.parse(message.deviceDetails);
    if (isDeviceDetailsResponse(deviceDetails)) {
        return deviceDetails;
    } else {
        throw Error('Unable to parse as device details object');
    }
}

/**
 * Parses and returns related device from given device details message.
 * @param message DeviceDetailsMessage
 * @returns Device
 */
export function deviceFromSerializableDeviceMessage(message: DeviceDetailsMessage): Device {
    const device: unknown = JSON.parse(message.device);
    if (isDevice(device)) {
        return device;
    } else {
        throw Error('Unable to parse as device object');
    }
}

export interface LinkDetailsMessage {
    action: 'viewLinkDetails';
    linkDetails: string;
}

export function isLinkDetailsMessage(message: unknown): message is LinkDetailsMessage {
    return (
        message !== null &&
        typeof message === 'object' &&
        'action' in message &&
        typeof message.action === 'string' &&
        message.action === 'viewLinkDetails' &&
        'linkDetails' in message &&
        typeof message.linkDetails === 'string'
    );
}

/**
 * Parses and returns related DisplayEdge from given link details message.
 * @param message LinkDetailsMessage
 * @returns DisplayEdge
 */
export function linkFromSerializableLinkMessage(message: LinkDetailsMessage): DisplayEdge {
    const linkEdge: unknown = JSON.parse(message.linkDetails);
    if (isDisplayEdge(linkEdge)) {
        return linkEdge;
    } else {
        throw Error('Unable to parse as DisplayEdge object');
    }
}

export interface LoadMapSettingsMessage {
    action: 'loadMapSettings';
}

export function isLoadMapSettingsMessage(message: unknown): message is LoadMapSettingsMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        message.action === 'loadMapSettings'
    );
}

export interface MapSettingsMessage {
    action: 'mapSettings';
    drawSettings: string;
    layoutSettings: string;
    imageSettings: string;
    backButton: boolean;
}

export function isMapSettingsMessage(message: unknown): message is MapSettingsMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        message.action === 'mapSettings' &&
        'drawSettings' in message &&
        isDrawSettings(JSON.parse(message.drawSettings?.toString() ?? '')) &&
        'layoutSettings' in message &&
        isLayoutSettings(JSON.parse(message.layoutSettings?.toString() ?? '')) &&
        'imageSettings' in message &&
        isImageSettings(JSON.parse(message.imageSettings?.toString() ?? '')) &&
        'backButton' in message &&
        typeof message.backButton === 'boolean'
    );
}

export interface SelectedMapSettingsMessage {
    action: 'saveMapSettings';
    drawSettings: DrawSettings;
    layoutSettings: LayoutSettings;
    imageSettings: ImageSettings;
}

export function isSelectedMapSettingsMessage(message: unknown): message is SelectedMapSettingsMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        message.action === 'saveMapSettings' &&
        'drawSettings' in message &&
        isDrawSettings(message.drawSettings) &&
        'layoutSettings' in message &&
        isLayoutSettings(message.layoutSettings) &&
        'imageSettings' in message &&
        isImageSettings(message.imageSettings)
    );
}

export interface RelistDevicesMessage {
    action: 'relistNetworks';
}

export function isRelistDevicesMessage(message: unknown): message is RelistDevicesMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        message.action === 'relistDevices'
    );
}

export interface RelistNetworksMessage {
    action: 'relistNetworks';
}

export function isRelistNetworksMessage(message: unknown): message is RelistNetworksMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        message.action === 'relistNetworks'
    );
}

export interface DeviceFilterMessage {
    action: 'dynSelectFilter';
    filter: DeviceFilter;
}

export function isDeviceFilterMessage(message: unknown): message is DeviceFilterMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        typeof message.action === 'string' &&
        message.action === 'dynSelectFilter' &&
        'filter' in message &&
        isDeviceFilter(message.filter)
    );
}
