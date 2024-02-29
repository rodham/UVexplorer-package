import { NetworkSummary } from 'model/uvx/network';
import { Device } from 'model/uvx/device';

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
