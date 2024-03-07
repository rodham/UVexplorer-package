import { NetworkSummary } from 'model/uvx/network';
import { Device, DeviceConnection, DeviceLinkEdge, Point } from 'model/uvx/device';
import { NetworkDeviceBlock } from '@blocks/network-device-block';
import { ItemProxy } from 'lucid-extension-sdk';

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
