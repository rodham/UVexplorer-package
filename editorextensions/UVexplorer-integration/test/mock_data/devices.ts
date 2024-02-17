import { Device, NetworkSummary } from 'model/uvexplorer-model';

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
