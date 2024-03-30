import { isPointLike } from 'lucid-extension-sdk';

// DeviceFilter
export interface IpRange {
    min_address: string;
    max_address: string;
}

export interface Subnet {
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

export interface IpScope {
    addresses?: string[];
    ranges?: IpRange[];
    subnets?: Subnet[];
    octet_ranges?: OctetRange[];
    hosts?: string[];
}

export interface DeviceCategoryFilter {
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

//DeviceDetails
export interface DeviceDetailsResponse {
    deviceGuid: string;
    displayName: string;
    infoSets: DeviceDetailsInfoSet[];
}

export function isDeviceDetailsResponse(obj: unknown): obj is DeviceDetailsResponse {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'deviceGuid' in obj &&
        typeof obj.deviceGuid === 'string' &&
        'displayName' in obj &&
        typeof obj.displayName === 'string' &&
        'infoSets' in obj &&
        Array.isArray(obj.infoSets) &&
        obj.infoSets.every(isDeviceDetailsInfoSet)
    );
}

interface DeviceDetailsInfoSet {
    infoSetName: string;
    title: string;
    columns: Column[];
    entries: Entry[];
    noVm?: boolean;
    noWireless?: boolean;
    allWirelessOrVm?: boolean;
}

function isDeviceDetailsInfoSet(obj: unknown): obj is DeviceDetailsInfoSet {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'infoSetName' in obj &&
        typeof obj.infoSetName === 'string' &&
        'title' in obj &&
        typeof obj.title === 'string' &&
        'columns' in obj &&
        Array.isArray(obj.columns) &&
        obj.columns.every(isColumn) &&
        'entries' in obj &&
        Array.isArray(obj.entries) &&
        obj.entries.every(isEntry) &&
        (!('noVm' in obj) || typeof obj.noVm === 'boolean') &&
        (!('noWireless' in obj) || typeof obj.noWireless === 'boolean') &&
        (!('allWirelessOrVm' in obj) || typeof obj.allWirelessOrVm === 'boolean')
    );
}

interface Column {
    field: string;
    header: string;
    type: string;
    visible: boolean;
}

function isColumn(obj: unknown): obj is Column {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'field' in obj &&
        typeof obj.field === 'string' &&
        'header' in obj &&
        typeof obj.header === 'string' &&
        'type' in obj &&
        typeof obj.type === 'string' &&
        'visible' in obj &&
        typeof obj.visible === 'boolean'
    );
}

interface Entry {
    groupKey: string;
    values: Value[];
}

function isEntry(obj: unknown): obj is Entry {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'groupKey' in obj &&
        typeof obj.groupKey === 'string' &&
        'values' in obj &&
        Array.isArray(obj.values) &&
        obj.values.every(isValue)
    );
}

interface Value {
    value: string | null;
    tagText: string | null;
}

function isValue(obj: unknown): obj is Value {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'value' in obj &&
        (obj.value === null || typeof obj.value === 'string') &&
        'tagText' in obj &&
        (obj.tagText === null || typeof obj.tagText === 'string')
    );
}

export interface DeviceCategoryListResponse {
    device_categories: string[];
}

export function isDeviceCategoryListResponse(obj: unknown): obj is DeviceCategoryListResponse {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'device_categories' in obj &&
        Array.isArray(obj.device_categories) &&
        obj.device_categories.every((category: unknown) => typeof category === 'string')
    );
}

export interface InfoSet {
    name: string;
    description: string;
}

function isInfoSet(obj: unknown): obj is Value {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'name' in obj &&
        typeof obj.name === 'string' &&
        'description' in obj &&
        typeof obj.description === 'string'
    );
}

export interface InfoSetListResponse {
    info_sets: InfoSet[];
}

export function isInfoSetListResponse(obj: unknown): obj is InfoSetListResponse {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'info_sets' in obj &&
        Array.isArray(obj.info_sets) &&
        obj.info_sets.every(isInfoSet)
    );
}

//Device
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

export function getNameFromDevice(device: Device) {
    const infoSets = device.info_sets;
    if (typeof infoSets === 'object' &&
        infoSets != null &&
        'system_info' in infoSets &&
        typeof infoSets.system_info === 'object' &&
        infoSets.system_info !== null &&
        'name' in infoSets.system_info &&
        typeof infoSets.system_info.name === 'string'
    ) {
        return infoSets.system_info.name;
    }
    return '';
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
export interface DeviceLink {
    linkType: string;
    noWireless: boolean;
    allWirelessOrVm: boolean;
    noVm: boolean;
    linkMembers: DeviceLinkMember[];
    linkEdges: DeviceLinkEdge[];
    monitorState: MonitorState;
    //sensorID: number;
    //sensorState: number;
}

export function isDeviceLink(obj: unknown): obj is DeviceLink {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        'linkType' in obj &&
        typeof obj.linkType === 'string' &&
        'noWireless' in obj &&
        typeof obj.noWireless === 'boolean' &&
        'allWirelessOrVm' in obj &&
        typeof obj.allWirelessOrVm === 'boolean' &&
        'noVm' in obj &&
        typeof obj.noVm === 'boolean' &&
        'linkMembers' in obj &&
        Array.isArray(obj.linkMembers) &&
        obj.linkMembers.every((member) => isDeviceLinkMember(member)) &&
        'linkEdges' in obj &&
        Array.isArray(obj.linkEdges) &&
        obj.linkEdges.every((edge) => isDeviceLinkEdge(edge)) &&
        'monitorState' in obj &&
        typeof obj.monitorState === 'number' &&
        Object.values(MonitorState).includes(obj.monitorState)
    );
}

export interface DeviceLinkMember {
    deviceGuid: string;
    deviceName: string;
    deviceIpAddress: string;
    deviceMacAddress: string;
    ifIndex: string;
    ifName: string;
    monitorState: MonitorState;
    connectedDeviceGuid: string;
    connectedDevice: string;
    connectedIfIndex: string;
    connectedIfName: string;
    connectedMonitorState: MonitorState;
    radio: string | null;
    ssid: string | null;
    virtualPort: string | null;
    virtualPortGroup: string | null;
    linkType: string;
    //sensorID: number | null;
    //sensorState: number | null;
}

export function isDeviceLinkMember(obj: unknown): obj is DeviceLinkMember {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        'deviceGuid' in obj &&
        typeof obj.deviceGuid === 'string' &&
        'deviceName' in obj &&
        typeof obj.deviceName === 'string' &&
        'deviceIpAddress' in obj &&
        typeof obj.deviceIpAddress === 'string' &&
        'deviceMacAddress' in obj &&
        typeof obj.deviceMacAddress === 'string' &&
        'ifIndex' in obj &&
        typeof obj.ifIndex === 'string' &&
        'ifName' in obj &&
        typeof obj.ifName === 'string' &&
        'monitorState' in obj &&
        typeof obj.monitorState === 'number' &&
        Object.values(MonitorState).includes(obj.monitorState) &&
        'connectedDeviceGuid' in obj &&
        typeof obj.connectedDeviceGuid === 'string' &&
        'connectedDevice' in obj &&
        typeof obj.connectedDevice === 'string' &&
        'connectedIfIndex' in obj &&
        typeof obj.connectedIfIndex === 'string' &&
        'connectedIfName' in obj &&
        typeof obj.connectedIfName === 'string' &&
        'connectedMonitorState' in obj &&
        typeof obj.connectedMonitorState === 'number' &&
        Object.values(MonitorState).includes(obj.connectedMonitorState) &&
        ('radio' in obj ? typeof obj.radio === 'string' || obj.radio === null : false) &&
        ('ssid' in obj ? typeof obj.ssid === 'string' || obj.ssid === null : false) &&
        ('virtualPort' in obj ? typeof obj.virtualPort === 'string' || obj.virtualPort === null : false) &&
        ('virtualPortGroup' in obj
            ? typeof obj.virtualPortGroup === 'string' || obj.virtualPortGroup === null
            : false) &&
        'linkType' in obj &&
        typeof obj.linkType === 'string'
    );
}

export class DeviceLinkEdge {
    localConnection: DeviceConnection;
    remoteConnection: DeviceConnection;

    constructor(localConnection: DeviceConnection, remoteConnection: DeviceConnection) {
        this.localConnection = localConnection;
        this.remoteConnection = remoteConnection;
    }
}

export function isDeviceLinkEdge(obj: unknown): obj is DeviceLinkEdge {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        'localConnection' in obj &&
        typeof obj.localConnection === 'object' &&
        isDeviceConnection(obj.localConnection) &&
        'remoteConnection' in obj &&
        typeof obj.remoteConnection === 'object' &&
        isDeviceConnection(obj.remoteConnection)
    );
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
    //sensorStatus: number;
    //sensorId: number;
    //sensorName: string;
}

export function isDeviceConnection(obj: unknown): obj is DeviceConnection {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        'deviceGuid' in obj &&
        typeof obj.deviceGuid === 'string' &&
        'nodeId' in obj &&
        typeof obj.nodeId === 'number' &&
        'start' in obj &&
        typeof obj.start === 'object' &&
        isPointLike(obj.start) &&
        'end' in obj &&
        typeof obj.end === 'object' &&
        isPointLike(obj.end) &&
        'mid' in obj &&
        typeof obj.mid === 'object' &&
        isPointLike(obj.mid) &&
        'connectionType' in obj &&
        obj.connectionType !== null &&
        Object.values(ConnectionType).includes(obj.connectionType as ConnectionType) &&
        'interfaceLabels' in obj &&
        Array.isArray(obj.interfaceLabels) &&
        obj.interfaceLabels.every((val) => typeof val === 'string') &&
        'deviceIpAddress' in obj &&
        typeof obj.deviceIpAddress === 'string' &&
        'deviceMacAddress' in obj &&
        typeof obj.deviceMacAddress === 'string' &&
        'deviceIfIndex' in obj &&
        typeof obj.deviceIfIndex === 'number' &&
        'monitorState' in obj &&
        obj.monitorState !== null &&
        Object.values(MonitorState).includes(obj.monitorState as MonitorState)
    );
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
