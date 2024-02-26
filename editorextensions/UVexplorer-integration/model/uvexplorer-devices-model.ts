// DeviceFilter
interface Range {
    min_address: string;
    max_address: string;
}

interface Subnet {
    ip_address: string;
    subnet_mask: string;
}

interface OctetRange {
    min_a: string;
    max_a: string;
    min_b: string;
    max_b: string;
    min_c: string;
    max_c: string;
    min_d: string;
    max_d: string;
}

interface IpScope {
    addresses?: string[];
    ranges?: Range[];
    subnets?: Subnet[];
    octet_ranges?: OctetRange[];
    hosts?: string[];
}

interface DeviceCategoryFilter {
    category_filter_type: 'All' | 'Any';
    category_names: string[];
}

export class DeviceFilter {
    include_scope: 'NoDevices' | 'AllDevices' | 'AllNetworkDevices' | 'AllSnmpDevices';
    device_names?: string[];
    ip_scopes?: IpScope[];
    device_categories?: DeviceCategoryFilter;
    vlans?: string[];
    system_oids?: string[];

    constructor(data: {
        include_scope: 'NoDevices' | 'AllDevices' | 'AllNetworkDevices' | 'AllSnmpDevices';
        device_names?: string[];
        ip_scopes?: IpScope[];
        device_categories?: DeviceCategoryFilter;
        vlans?: string[];
        system_oids?: string[];
    }) {
        this.include_scope = data.include_scope;
        this.device_names = data.device_names;
        this.ip_scopes = data.ip_scopes;
        this.device_categories = data.device_categories;
        this.vlans = data.vlans;
        this.system_oids = data.system_oids;
    }
}

// ConnectedDevicesRequest
export class ConnectedDevicesRequest {
    device_guids: string[];
    device_filter?: DeviceFilter;
    info_set_names?: string[];

    constructor(device_guids: string[], device_filter?: DeviceFilter, info_set_names?: string[]) {
        this.device_guids = device_guids;
        this.device_filter = device_filter;
        this.info_set_names = info_set_names;
    }
}

// DeviceListRequest
export class DeviceListRequest {
    device_filter?: DeviceFilter;
    info_set_names?: string[];

    constructor(device_filter?: DeviceFilter, info_set_names?: string[]) {
        this.device_filter = device_filter;
        this.info_set_names = info_set_names;
    }
}

// DeviceListResponse
interface CollectorProfileEntry {
    collector_name: string;
    source_name: string;
}

function isCollectorProfileEntry(obj: unknown): obj is CollectorProfileEntry {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'collector_name' in obj &&
        typeof obj.collector_name === 'string' &&
        'source_name' in obj &&
        typeof obj.source_name === 'string'
    );
}

export interface DeviceClass {
    collector_profile?: {
        entries: CollectorProfileEntry[];
    };
}

function isDeviceClass(obj: unknown): obj is DeviceClass {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        (!('collector_profile' in obj) ||
            (typeof obj.collector_profile === 'object' &&
                obj.collector_profile !== null &&
                'entries' in obj.collector_profile &&
                Array.isArray(obj.collector_profile.entries) &&
                obj.collector_profile.entries.every(isCollectorProfileEntry)))
    );
}

export interface DeviceCategoryEntry {
    device_category: string;
    source_name: string;
}

function isDeviceCategoryEntry(obj: unknown): obj is DeviceCategoryEntry {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'device_category' in obj &&
        typeof obj.device_category === 'string' &&
        'source_name' in obj &&
        typeof obj.source_name === 'string'
    );
}

export interface DeviceCategories {
    entries?: DeviceCategoryEntry[];
}

function isDeviceCategories(obj: unknown): obj is DeviceCategories {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        ('entries' in obj ? Array.isArray(obj.entries) && obj.entries.every(isDeviceCategoryEntry) : true)
    );
}

export interface ProtocolProfileEntry {
    protocol_name: string;
    protocol_settings: unknown;
}

function isProtocolProfileEntry(obj: unknown): obj is ProtocolProfileEntry {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'protocol_name' in obj &&
        typeof obj.protocol_name === 'string' &&
        'protocol_settings' in obj &&
        typeof obj.protocol_settings === 'object' // Adjust this condition based on the actual structure of protocol_settings
    );
}

export interface ProtocolProfile {
    entries: ProtocolProfileEntry[];
}

function isProtocolProfile(obj: unknown): obj is ProtocolProfile {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'entries' in obj &&
        Array.isArray(obj.entries) &&
        obj.entries.every(isProtocolProfileEntry)
    );
}

export interface DeviceListResponse {
    devices: Device[];
}

export function isDeviceListResponse(obj: unknown): obj is DeviceListResponse {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'devices' in obj &&
        Array.isArray(obj.devices) &&
        obj.devices.every(isDevice)
    );
}

export class Device {
    ip_address: string;
    mac_address: string;
    guid: string;
    info_sets: unknown;
    device_class: DeviceClass;
    device_categories: DeviceCategories;
    protocol_profile: ProtocolProfile;
    timestamp: string;
    custom_name?: string;

    constructor(
        ip_address: string,
        mac_address: string,
        guid: string,
        info_sets: unknown,
        device_class: DeviceClass,
        device_categories: DeviceCategories,
        protocol_profile: ProtocolProfile,
        timestamp: string,
        custom_name?: string
    ) {
        this.ip_address = ip_address;
        this.mac_address = mac_address;
        this.guid = guid;
        this.info_sets = info_sets;
        this.device_class = device_class;
        this.device_categories = device_categories;
        this.protocol_profile = protocol_profile;
        this.timestamp = timestamp;
        this.custom_name = custom_name;
    }
}

export function isDevice(obj: unknown): obj is Device {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'ip_address' in obj &&
        typeof obj.ip_address === 'string' &&
        ('mac_address' in obj ? typeof obj.mac_address === 'string' : true) &&
        'guid' in obj &&
        typeof obj.guid === 'string' &&
        'info_sets' in obj && // Adjust this condition based on the actual structure of info_sets
        'device_class' in obj &&
        isDeviceClass(obj.device_class) &&
        'device_categories' in obj &&
        isDeviceCategories(obj.device_categories) &&
        'protocol_profile' in obj &&
        isProtocolProfile(obj.protocol_profile) &&
        'timestamp' in obj &&
        typeof obj.timestamp === 'string' &&
        ('custom_name' in obj ? typeof obj.custom_name === 'string' : true)
    );
}

// DeviceNode
export interface DeviceNode {
    id: number;
    groupId: number;
    deviceGuid: string;
    nodeId: number;
    displayName: string;
    ipAddress: string;
    macAddress: string;
    hostname: string;
    systemName: string;
    netBiosName: string;
    categories: DeviceNodeCategories;
    vendor: string;
    status: DeviceState;
    x: number;
    y: number;
    centerX: number;
    centerY: number;
    bottom: number;
    width: number;
    height: number;
    selected?: boolean;
}

export enum DeviceNodeCategoryType {
    System = 0,
    User = 1
}

export interface DeviceNodeCategoryEntry {
    categoryName: string;
    categoryType: DeviceNodeCategoryType;
}

export interface DeviceNodeCategories {
    entries?: DeviceNodeCategoryEntry[];
}

export enum DeviceState {
    Unknown = 0,
    Down,
    Warning,
    Information,
    Up,
    Paused,
    NoData
}

// DeviceLink
export class DeviceLink {
    linkType: string;
    noWireless: boolean;
    allWirelessOrVm: boolean;
    noVm: boolean;
    linkMembers: DeviceLinkMember[];
    linkEdges: DeviceLinkEdge[];
    monitorState: MonitorState;

    constructor(linkType: string, noWireless: boolean, allWirelessOrVm: boolean, noVm: boolean, linkMembers: DeviceLinkMember[], linkEdges: DeviceLinkEdge[], monitorState: MonitorState) {
        this.linkType = linkType;
        this.noWireless = noWireless;
        this.allWirelessOrVm = allWirelessOrVm;
        this.noVm = noVm;
        this.linkMembers = linkMembers;
        this.linkEdges = linkEdges;
        this.monitorState = monitorState;
    }
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

export interface DeviceLinkEdge {
    localConnection: DeviceConnection;
    remoteConnection: DeviceConnection;
}

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

export enum ConnectionType {
    Standard,
    Lag,
    Manual,
    Association,
    Multi
}

export interface Point {
    x: number;
    y: number;
}
