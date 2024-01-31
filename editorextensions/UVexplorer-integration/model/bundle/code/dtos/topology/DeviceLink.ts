import { DeviceLinkEdge } from './DeviceLinkEdge';
import { MonitorState } from './DeviceConnection';

export interface DeviceLink {
    linkType: string;
    noWireless: boolean;
    allWirelessOrVm: boolean;
    noVm: boolean;
    linkMembers: DeviceLinkMember[];
    linkEdges: DeviceLinkEdge[];
    monitorState: MonitorState;
}

export interface DeviceLinkMember {
    deviceGuid: string;
    deviceName: string;
    deviceIpAddress: string;
    deviceMacAddress: string;
    ifIndex: number;
    ifName: string;
    monitorState: MonitorState;
    connectedDeviceGuid: string;
    connectedDevice: string;
    connectedIfIndex: number;
    connectedIfName: string;
    connectedMonitorState: MonitorState;
    radio: string;
    ssid: string;
    virtualPort: string;
    virtualPortGroup: string;
    linkType: string;
}
