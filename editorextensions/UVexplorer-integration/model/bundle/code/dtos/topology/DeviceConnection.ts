import { Point } from './Point';
import { ConnectionType } from './ConnectionType';

export enum MonitorState {
    Unknown = 0,
    Down,
    Warning,
    Information,
    Up,
    Paused,
    NoData
}

export interface DeviceConnection {
    deviceGuid: string;
    nodeId: number;
    start: Point;
    end: Point;
    mid: Point;
    connectionType: ConnectionType;
    interfaceLabels: string[];
    deviceIpAddress: string;
    deviceMacAddress: string;
    deviceIfIndex: number;
    monitorState: MonitorState;
}
