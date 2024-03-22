import { NetworkSummary } from 'model/uvx/network';
import {
    ConnectionType,
    Device,
    DeviceConnection,
    DeviceLink,
    DeviceLinkEdge,
    MonitorState,
    Point
} from 'model/uvx/device';
import { NetworkDeviceBlock } from '@blocks/network-device-block';
import { ItemProxy } from 'lucid-extension-sdk';
import { DisplayEdge } from 'model/uvx/display-edge';
import { DisplayEdgeSet } from 'model/uvx/display-edge-set';

export const mockDeviceList = [
    {
        guid: 'device1'
    },
    {
        guid: 'device2'
    },
    {
        guid: 'device3'
    }
] as Device[];

export const mockDeviceList2 = [
    {
        guid: 'device1'
    },
    {
        guid: 'device2'
    }
] as Device[];

export const mockDeviceGuids = [
    '91bacb89-680d-47a6-9781-7165c4e6e510',
    '174fe226-c743-4b53-94cc-8fca0377e339',
    'fcfbc3a2-f469-4f94-b777-4d1c2b827ca9'
];

export const mockDeviceGuids2 = ['62d274c4-f7cf-48e0-8d3e-9c3f9df6f6c7', 'f2149d9c-419d-4487-869c-5bc84f117980'];

export const mockNetworkSummaryList = [
    {
        guid: 'networkGuid1',
        created_time: '16:27',
        modified_time: '16:28:05',
        name: 'network1',
        description: 'This is my network'
    },
    {
        guid: 'networkGuid2',
        created_time: '16:28',
        modified_time: '16:29:07',
        name: 'network2',
        description: 'This is also my network'
    }
] as NetworkSummary[];

export const mockNetworkDevice1 = {
    shapeData: {
        get: (_key: string) => {
            return 'dab5626b-d9d5-46fd-bf6a-f1baef34889f';
        }
    }
} as ItemProxy;

export const mockNetworkDevice2 = {
    shapeData: {
        get: (_key: string) => {
            return '20114946-cae7-4453-bec4-035daa310c2e';
        }
    }
} as ItemProxy;

export const mockEndpoint1 = {
    connection: mockNetworkDevice1
};

export const mockEndpoint2 = {
    connection: mockNetworkDevice2
};

export const mockLinesSelection = [
    {
        getEndpoint1: () => {
            return mockEndpoint1;
        },
        getEndpoint2: () => {
            return mockEndpoint2;
        }
    }
];

export const mockSelectedNetworkDevices = [
    {
        shapeData: {
            get: (_key: string) => {
                return '5983b166-0e01-434d-9cc5-4889a5ff349a';
            }
        },
        getConnectedLines: () => {
            return mockLinesSelection;
        }
    }
] as NetworkDeviceBlock[];

export const mockConnection1 = {
    deviceGuid: 'abcd',
    nodeId: 1,
    start: {
        x: 123,
        y: 456
    } as Point,
    end: {
        x: 789,
        y: 120
    } as Point,
    mid: {
        x: 345,
        y: 678
    } as Point,
    connectionType: 1,
    interfaceLabels: [] as string[],
    deviceIpAddress: 'asdf',
    deviceMacAddress: 'jkl',
    deviceIfIndex: 2,
    monitorState: 1
} as DeviceConnection;

export const mockConnection2 = {
    deviceGuid: 'abcde',
    nodeId: 2,
    start: {
        x: 23,
        y: 56
    } as Point,
    end: {
        x: 89,
        y: 12
    } as Point,
    mid: {
        x: 45,
        y: 78
    } as Point,
    connectionType: 2,
    interfaceLabels: [] as string[],
    deviceIpAddress: 'sdf',
    deviceMacAddress: 'ajkl',
    deviceIfIndex: 1,
    monitorState: 2
} as DeviceConnection;

export const mockDeviceLinkEdge = {
    localConnection: mockConnection1,
    remoteConnection: mockConnection2
} as DeviceLinkEdge;

export const mockDisplayEdge1 = {
    nodeId1: 0,
    nodeId2: 1,
    deviceLinks: [{} as DeviceLink],
    get key(): string {
        return '0-1'
    }
} as DisplayEdge

export const mockDisplayEdge2 = {
    nodeId1: 0,
    nodeId2: 2,
    deviceLinks: [{} as DeviceLink],
    get key(): string {
        return '0-2'
    }
} as DisplayEdge


export const mockDisplayEdgeSet = {
    map: new Map<string, DisplayEdge>([[mockDisplayEdge1.key, mockDisplayEdge1],[mockDisplayEdge2.key, mockDisplayEdge2]])
} as DisplayEdgeSet

export const mockDeviceLink2: DeviceLink = {
    allWirelessOrVm: false,
    linkEdges: [
        {
            localConnection: {
                deviceGuid: '00000000-0000-0000-0000-000000000000',
                nodeId: 0,
                start: { x: 0, y: 0 },
                end: { x: 0, y: 0 },
                mid: { x: 0, y: 0 },
                connectionType: ConnectionType.Standard,
                interfaceLabels: [],
                deviceIpAddress: '',
                deviceMacAddress: '',
                deviceIfIndex: 0,
                monitorState: MonitorState.Up
            },
            remoteConnection: {
                deviceGuid: '11111111-1111-1111-1111-111111111111',
                nodeId: 1,
                start: { x: 0, y: 0 },
                end: { x: 0, y: 0 },
                mid: { x: 0, y: 0 },
                connectionType: ConnectionType.Standard,
                interfaceLabels: [],
                deviceIpAddress: '',
                deviceMacAddress: '',
                deviceIfIndex: 0,
                monitorState: MonitorState.Up
            }
        },
        {
            localConnection: {
                deviceGuid: '00000000-0000-0000-0000-000000000000',
                nodeId: 0,
                start: { x: 0, y: 0 },
                end: { x: 0, y: 0 },
                mid: { x: 0, y: 0 },
                connectionType: ConnectionType.Standard,
                interfaceLabels: [],
                deviceIpAddress: '',
                deviceMacAddress: '',
                deviceIfIndex: 0,
                monitorState: MonitorState.Up
            },
            remoteConnection: {
                deviceGuid: '22222222-2222-2222-2222-222222222222',
                nodeId: 2,
                start: { x: 0, y: 0 },
                end: { x: 0, y: 0 },
                mid: { x: 0, y: 0 },
                connectionType: ConnectionType.Standard,
                interfaceLabels: [],
                deviceIpAddress: '',
                deviceMacAddress: '',
                deviceIfIndex: 0,
                monitorState: MonitorState.Up
            }
        }
    ],
    linkMembers: [],
    linkType: '',
    monitorState: MonitorState.Up,
    noVm: false,
    noWireless: false
};
