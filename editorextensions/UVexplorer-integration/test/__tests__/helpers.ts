import { TextXHRResponse } from 'lucid-extension-sdk';
import {
    Device,
    DeviceCategoryListResponse,
    DeviceDetailsResponse,
    DeviceListResponse,
    InfoSetListResponse,
    NetworkSummariesResponse,
    NetworkSummary
} from '../../model/uvexplorer-model';
import { TopoMap } from '../../model/bundle/code/dtos/topology/TopoMap';

export const mockNetworkSummariesXHRResponse: TextXHRResponse = {
    url: 'https://my-uvexplorer-server.com/public/api/v1/network/list',
    status: 200,
    headers: {
        'content-type': 'application/json; charset=utf-8'
    },
    responseFormat: 'utf8',
    responseText:
        '{"network_summaries":[{"guid":"00000000-0000-0000-0000-000000000000","created_time":"2024-01-01T00:00:00.0000000Z","modified_time":"2024-01-01T00:00:00.0000000Z","name":"My Network","description":"Network description","agent_summaries":[{"guid":"00000000-0000-0000-0000-000000000000","created_time":"2024-01-01T00:00:00.0000000Z","modified_time":"2024-01-01T00:00:00.0000000Z","name":"My Agent","description":"Agent description","discovery_summaries":[{"guid":"00000000-0000-0000-0000-000000000000","created_time":"2024-01-01T00:00:00.0000000Z","modified_time":"2024-01-01T00:00:00.0000000Z","name":"My Network Discovery","discovery_run_summaries":[{"guid":"00000000-0000-0000-0000-000000000000","start_time":"2024-01-01T00:00:00.0000000Z","end_time":"2024-01-01T00:00:00.0000000Z"}]}]}]}]}'
};

export const mockNetworkSummary: NetworkSummary = {
    guid: '00000000-0000-0000-0000-000000000000',
    created_time: '2024-01-01T00:00:00.0000000Z',
    modified_time: '2024-01-01T00:00:00.0000000Z',
    name: 'My Network',
    description: 'Network description',
    agent_summaries: [
        {
            guid: '00000000-0000-0000-0000-000000000000',
            created_time: '2024-01-01T00:00:00.0000000Z',
            modified_time: '2024-01-01T00:00:00.0000000Z',
            name: 'My Agent',
            description: 'Agent description',
            discovery_summaries: [
                {
                    guid: '00000000-0000-0000-0000-000000000000',
                    created_time: '2024-01-01T00:00:00.0000000Z',
                    modified_time: '2024-01-01T00:00:00.0000000Z',
                    name: 'My Network Discovery',
                    discovery_run_summaries: [
                        {
                            guid: '00000000-0000-0000-0000-000000000000',
                            start_time: '2024-01-01T00:00:00.0000000Z',
                            end_time: '2024-01-01T00:00:00.0000000Z'
                        }
                    ]
                }
            ]
        }
    ]
};

export const mockNetworkSummariesResponse: NetworkSummariesResponse = {
    network_summaries: [mockNetworkSummary]
};

export const mockDeviceListXHRResponse: TextXHRResponse = {
    url: 'https://my-uvexplorer-server.com/public/api/v1/device/list',
    status: 200,
    headers: {
        'content-type': 'application/json; charset=utf-8'
    },
    responseFormat: 'utf8',
    responseText:
        '{"devices":[{"ip_address":"0.0.0.0","mac_address":"ff0000000000","guid":"00000000-0000-0000-0000-000000000000","info_sets":{"attr_info":{"entries":[{"attribute_name":"NetGenDeviceId","attribute_value":"1"}]},"system_info":{"name":"ROUTER 1","oid":"1.1.1.1.1.1.1.1.1.1.1.1","host_name":"router-1.acme.com","netbios_server":"False"}},"device_class":{},"device_categories":{"entries":[{"device_category":"snmp","source_name":"default-classifier"},{"device_category":"router","source_name":"default-classifier"}]},"protocol_profile":{"entries":[]},"timestamp":"2024-01-01T00:00:00.0000000Z"}]}'
};

export const mockDevice: Device = {
    ip_address: '0.0.0.0',
    mac_address: 'ff0000000000',
    guid: '00000000-0000-0000-0000-000000000000',
    info_sets: {
        attr_info: {
            entries: [
                {
                    attribute_name: 'NetGenDeviceId',
                    attribute_value: '1'
                }
            ]
        },
        system_info: {
            name: 'ROUTER 1',
            oid: '1.1.1.1.1.1.1.1.1.1.1.1',
            host_name: 'router-1.acme.com',
            netbios_server: 'False'
        }
    },
    device_categories: {
        entries: [
            {
                device_category: 'snmp',
                source_name: 'default-classifier'
            },
            { device_category: 'router', source_name: 'default-classifier' }
        ]
    },
    device_class: {},
    protocol_profile: {
        entries: []
    },
    timestamp: '2024-01-01T00:00:00.0000000Z'
};

export const mockDeviceListResponse: DeviceListResponse = {
    devices: [mockDevice]
};

export const mockDeviceCategoryListXHRResponse: TextXHRResponse = {
    url: 'https://my-uvexplorer-server.com/public/api/v1/device/category/list',
    status: 200,
    headers: {
        'content-type': 'application/json; charset=utf-8'
    },
    responseFormat: 'utf8',
    responseText: '{"device_categories":["router","snmp"]}'
};

export const mockDeviceCategoryResponse: DeviceCategoryListResponse = {
    device_categories: ['router', 'snmp']
};

export const mockInfoSetListXHRResponse: TextXHRResponse = {
    url: 'https://my-uvexplorer-server.com/public/api/v1/device/infoset/list',
    status: 200,
    headers: {
        'content-type': 'application/json; charset=utf-8'
    },
    responseFormat: 'utf8',
    responseText:
        '{"info_sets":[{"name":"ip-info","description":"IP Address Configuration"},{"name":"system-info","description":"MIB II System Group"}]}'
};

export const mockInfoSetListResponse: InfoSetListResponse = {
    info_sets: [
        { name: 'ip-info', description: 'IP Address Configuration' },
        { name: 'system-info', description: 'MIB II System Group' }
    ]
};

export const mockDeviceDetailsXHRResponse: TextXHRResponse = {
    url: 'https://my-uvexplorer-server.com/public/api/v1/device/details/00000000-0000-0000-0000-000000000000',
    status: 200,
    headers: {
        'content-type': 'application/json; charset=utf-8'
    },
    responseFormat: 'utf8',
    responseText:
        '{"deviceGuid":"00000000-0000-0000-0000-000000000000","displayName":"ROUTER 1","infoSets":[{"infoSetName":"system-info","title":"System","columns":[{"field":"name","header":"Name","type":"string","visible":true},{"field":"value","header":"Value","type":"string","visible":true}],"entries":[{"groupKey":"","values":[{"value":"Display Name","tagText":"Display Name"},{"value":"ROUTER 1","tagText":"ROUTER 1"}]},{"groupKey":"","values":[{"value":"IP Address","tagText":"IP Address"},{"value":"0.0.0.0","tagText":"0.0.0.0"}]}]}]}'
};

export const mockDeviceDetailsResponse: DeviceDetailsResponse = {
    deviceGuid: '00000000-0000-0000-0000-000000000000',
    displayName: 'ROUTER 1',
    infoSets: [
        {
            infoSetName: 'system-info',
            title: 'System',
            columns: [
                {
                    field: 'name',
                    header: 'Name',
                    type: 'string',
                    visible: true
                },
                {
                    field: 'value',
                    header: 'Value',
                    type: 'string',
                    visible: true
                }
            ],
            entries: [
                {
                    groupKey: '',
                    values: [
                        {
                            value: 'Display Name',
                            tagText: 'Display Name'
                        },
                        {
                            value: 'ROUTER 1',
                            tagText: 'ROUTER 1'
                        }
                    ]
                },
                {
                    groupKey: '',
                    values: [
                        {
                            value: 'IP Address',
                            tagText: 'IP Address'
                        },
                        {
                            value: '0.0.0.0',
                            tagText: '0.0.0.0'
                        }
                    ]
                }
            ]
        }
    ]
};

export const mockTopoMapXHRResponse: TextXHRResponse = {
    url: 'https://my-uvexplorer-server.com/public/api/v1/device/topomap',
    status: 200,
    headers: {
        'content-type': 'application/json; charset=utf-8'
    },
    responseFormat: 'utf8',
    responseText:
        '{"layoutSettings":{"layoutType":0,"useStraightLinks":true,"radialSettings":{"minRadius":200,"maxRadius":3000,"maxAngle":360,"maximizeRoot":true},"hierarchicalSettings":null,"ringSettings":{"minRadius":200,"maxRadius":3000,"maxAngle":360,"maximizeRoot":true},"showLayer2Links":true,"showVirtualLinks":false,"showWirelessLinks":false,"showIpPhoneLinks":false,"showLinkLabels":false,"rootNodes":[]},"drawSettings":{"shortDeviceNames":false,"deviceTrimLeft":false,"deviceTrimRight":false,"deviceTrimLeftChar":".","deviceTrimRightChar":".","deviceTrimRightCount":1,"deviceTrimLeftCount":1,"shortIfNames":false,"hideVendorImage":false,"hidePlatformImage":false,"deviceDisplaySetting":0,"standardPen":{"color":{"red":0,"green":0,"blue":0},"width":1.0,"dashStyle":0},"lagPen":{"color":{"red":0,"green":0,"blue":0},"width":1.0,"dashStyle":0},"manualPen":{"color":{"red":0,"green":0,"blue":0},"width":1.0,"dashStyle":0},"associatedPen":{"color":{"red":0,"green":0,"blue":0},"width":1.0,"dashStyle":0},"multiPen":{"color":{"red":0,"green":0,"blue":0},"width":1.0,"dashStyle":0},"stpForwardingPen":{"color":{"red":0,"green":0,"blue":0},"width":1.0,"dashStyle":0},"stpBlockingPen":{"color":{"red":0,"green":0,"blue":0},"width":1.0,"dashStyle":0}},"deviceNodes":[{"id":-1,"groupId":-1,"deviceGuid":"2e8faf21-24f4-44b5-b697-58d911d0a178","nodeId":1,"displayName":"ROUTER 1","ipAddress":"10.1.0.1","macAddress":"FF:00:00:00:00:02","hostname":"router-1.acme.com","systemName":"ROUTER 1","netBiosName":"","categories":{"entries":[{"categoryName":"snmp","categoryType":0},{"categoryName":"net-device","categoryType":0},{"categoryName":"core-device","categoryType":0},{"categoryName":"router","categoryType":0}]},"vendor":"Cisco","status":6,"x":0.0,"y":-118.0,"width":48.0,"height":48.0,"centerX":24.0,"centerY":-94.0,"bottom":-70.0},{"id":-1,"groupId":-1,"deviceGuid":"964b82f9-d380-43cb-9541-2f37495b0740","nodeId":2,"displayName":"SWITCH 2","ipAddress":"10.1.0.2","macAddress":"FF:00:00:00:00:06","hostname":"switch-2.acme.com","systemName":"SWITCH 2","netBiosName":"","categories":{"entries":[{"categoryName":"snmp","categoryType":0},{"categoryName":"net-device","categoryType":0},{"categoryName":"core-device","categoryType":0},{"categoryName":"switch","categoryType":0}]},"vendor":"Cisco","status":6,"x":118.0,"y":-118.0,"width":48.0,"height":48.0,"centerX":142.0,"centerY":-94.0,"bottom":-70.0}],"deviceGroupNodes":[],"hubNodes":[],"imageNodes":[],"deviceLinks":[],"width":166.0,"height":48.0,"top":-118.0,"bottom":-70.0,"right":166.0,"left":0.0,"centerX":83.0,"centerY":-94.0}'
};

export const mockTopoMap: TopoMap = {
    layoutSettings: {
        layoutType: 0,
        useStraightLinks: true,
        radialSettings: {
            minRadius: 200,
            maxRadius: 3000,
            maxAngle: 360,
            maximizeRoot: true
        },
        hierarchicalSettings: null,
        ringSettings: {
            minRadius: 200,
            maxRadius: 3000,
            maxAngle: 360,
            maximizeRoot: true
        },
        showLayer2Links: true,
        showVirtualLinks: false,
        showWirelessLinks: false,
        showIpPhoneLinks: false,
        showLinkLabels: false,
        rootNodes: []
    },
    drawSettings: {
        shortDeviceNames: false,
        deviceTrimLeft: false,
        deviceTrimRight: false,
        deviceTrimLeftChar: '.',
        deviceTrimRightChar: '.',
        deviceTrimRightCount: 1,
        deviceTrimLeftCount: 1,
        shortIfNames: false,
        hideVendorImage: false,
        hidePlatformImage: false,
        deviceDisplaySetting: 0,
        standardPen: {
            color: {
                red: 0,
                green: 0,
                blue: 0
            },
            width: 1,
            dashStyle: 0
        },
        lagPen: {
            color: {
                red: 0,
                green: 0,
                blue: 0
            },
            width: 1,
            dashStyle: 0
        },
        manualPen: {
            color: {
                red: 0,
                green: 0,
                blue: 0
            },
            width: 1,
            dashStyle: 0
        },
        associatedPen: {
            color: {
                red: 0,
                green: 0,
                blue: 0
            },
            width: 1,
            dashStyle: 0
        },
        multiPen: {
            color: {
                red: 0,
                green: 0,
                blue: 0
            },
            width: 1,
            dashStyle: 0
        },
        stpForwardingPen: {
            color: {
                red: 0,
                green: 0,
                blue: 0
            },
            width: 1,
            dashStyle: 0
        },
        stpBlockingPen: {
            color: {
                red: 0,
                green: 0,
                blue: 0
            },
            width: 1,
            dashStyle: 0
        }
    },
    deviceNodes: [
        {
            id: -1,
            groupId: -1,
            deviceGuid: '00000000-0000-0000-0000-0000000000000',
            nodeId: 1,
            displayName: 'ROUTER 1',
            ipAddress: '10.1.0.1',
            macAddress: 'FF:00:00:00:00:02',
            hostname: 'router-1.acme.com',
            systemName: 'ROUTER 1',
            netBiosName: '',
            categories: {
                entries: [
                    {
                        categoryName: 'snmp',
                        categoryType: 0
                    },
                    {
                        categoryName: 'net-device',
                        categoryType: 0
                    },
                    {
                        categoryName: 'core-device',
                        categoryType: 0
                    },
                    {
                        categoryName: 'router',
                        categoryType: 0
                    }
                ]
            },
            vendor: 'Cisco',
            status: 6,
            x: 0,
            y: -118,
            width: 48,
            height: 48,
            centerX: 24,
            centerY: -94,
            bottom: -70
        },
        {
            id: -1,
            groupId: -1,
            deviceGuid: '11111111-1111-1111-1111-111111111111',
            nodeId: 2,
            displayName: 'SWITCH 2',
            ipAddress: '10.1.0.2',
            macAddress: 'FF:00:00:00:00:06',
            hostname: 'switch-2.acme.com',
            systemName: 'SWITCH 2',
            netBiosName: '',
            categories: {
                entries: [
                    {
                        categoryName: 'snmp',
                        categoryType: 0
                    },
                    {
                        categoryName: 'net-device',
                        categoryType: 0
                    },
                    {
                        categoryName: 'core-device',
                        categoryType: 0
                    },
                    {
                        categoryName: 'switch',
                        categoryType: 0
                    }
                ]
            },
            vendor: 'Cisco',
            status: 6,
            x: 118,
            y: -118,
            width: 48,
            height: 48,
            centerX: 142,
            centerY: -94,
            bottom: -70
        }
    ],
    deviceGroupNodes: [],
    hubNodes: [],
    imageNodes: [],
    deviceLinks: [],
    width: 166,
    height: 48,
    top: -118,
    bottom: -70,
    right: 166,
    left: 0,
    centerX: 83,
    centerY: -94
};
