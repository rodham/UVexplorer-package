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
        obj.entries.every(isEntry)
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
    value: string;
    tagText: string;
}

function isValue(obj: unknown): obj is Value {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'value' in obj &&
        typeof obj.value === 'string' &&
        'tagText' in obj &&
        typeof obj.tagText === 'string'
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

export class NetworkRequest {
    network_guid: string;
    agent_guid?: string;
    sched_disc_guid?: string;
    sched_disc_result_guid?: string;

    constructor(network_guid: string, agent_guid?: string, sched_disc_guid?: string, sched_disc_result_guid?: string) {
        this.network_guid = network_guid;
        this.agent_guid = agent_guid;
        this.sched_disc_guid = sched_disc_guid;
        this.sched_disc_result_guid = sched_disc_result_guid;
    }
}

export interface NetworkSummariesResponse {
    network_summaries: NetworkSummary[];
}

export function isNetworkSummariesResponse(obj: unknown): obj is NetworkSummariesResponse {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'network_summaries' in obj &&
        Array.isArray(obj.network_summaries) &&
        obj.network_summaries.every(isNetworkSummary)
    );
}

export interface NetworkSummary {
    guid: string;
    created_time: string;
    modified_time: string;
    name: string;
    description: string;
    agent_summaries?: AgentSummary[];
}

export function isNetworkSummary(obj: unknown): obj is NetworkSummary {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'guid' in obj &&
        typeof obj.guid === 'string' &&
        'created_time' in obj &&
        typeof obj.created_time === 'string' &&
        'modified_time' in obj &&
        typeof obj.modified_time === 'string' &&
        'name' in obj &&
        typeof obj.name === 'string' &&
        'description' in obj &&
        typeof obj.description === 'string' &&
        ('agent_summaries' in obj
            ? Array.isArray(obj.agent_summaries) && obj.agent_summaries.every(isAgentSummary)
            : true)
    );
}

export interface AgentSummary {
    guid: string;
    created_time: string;
    modified_time: string;
    name: string;
    description: string;
    discovery_summaries: DiscoverySummary[];
}

function isAgentSummary(obj: unknown): obj is AgentSummary {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'guid' in obj &&
        typeof obj.guid === 'string' &&
        'created_time' in obj &&
        typeof obj.created_time === 'string' &&
        'modified_time' in obj &&
        typeof obj.modified_time === 'string' &&
        'name' in obj &&
        typeof obj.name === 'string' &&
        'description' in obj &&
        typeof obj.description === 'string' &&
        'discovery_summaries' in obj &&
        Array.isArray(obj.discovery_summaries) &&
        obj.discovery_summaries.every(isDiscoverySummary)
    );
}

export interface DiscoverySummary {
    guid: string;
    created_time: string;
    modified_time: string;
    name: string;
    discovery_run_summaries: DiscoveryRunSummary[];
}

function isDiscoverySummary(obj: unknown): obj is DiscoverySummary {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'guid' in obj &&
        typeof obj.guid === 'string' &&
        'created_time' in obj &&
        typeof obj.created_time === 'string' &&
        'modified_time' in obj &&
        typeof obj.modified_time === 'string' &&
        'name' in obj &&
        typeof obj.name === 'string' &&
        'discovery_run_summaries' in obj &&
        Array.isArray(obj.discovery_run_summaries) &&
        obj.discovery_run_summaries.every(isDiscoveryRunSummary)
    );
}

export interface DiscoveryRunSummary {
    guid: string;
    start_time: string;
    end_time: string;
}

function isDiscoveryRunSummary(obj: unknown): obj is DiscoveryRunSummary {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'guid' in obj &&
        typeof obj.guid === 'string' &&
        'start_time' in obj &&
        typeof obj.start_time === 'string' &&
        'end_time' in obj &&
        typeof obj.end_time === 'string'
    );
}

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

// TopoMapRequest
interface LayoutSettings {
    layoutType: 'Manual' | 'Radial' | 'Hierarchical' | 'Ring';
    useStraightLinks: boolean;
    showLayer2Links: boolean;
    showVirtualLinks: boolean;
    showWirelessLinks: boolean;
    showIpPhoneLinks: boolean;
    showLinkLabels: boolean;
    radialSettings?: {
        minRadius: number;
        maxRadius: number;
        maxAngle: number;
        maximizeRoot: boolean;
    };
    hierarchicalSettings?: {
        levelSpacing: number;
        useStraightLinks: boolean;
        nodeSpacing: number;
        layoutDirection: 'Left' | 'Right' | 'Up' | 'Down';
        rootAlignment: 'Left' | 'Center' | 'Right';
    };
    ringSettings?: {
        minRadius: number;
        maxRadius: number;
        maxAngle: number;
        maximizeRoot: boolean;
    };
}

interface DrawSettings {
    shortDeviceNames: boolean;
    deviceTrimLeft: boolean;
    deviceTrimRight: boolean;
    deviceTrimLeftChar: string;
    deviceTrimRightChar: string;
    deviceTrimRightCount: number;
    deviceTrimLeftCount: number;
    shortIfNames: boolean;
    hideVendorImage: boolean;
    hidePlatformImage: boolean;
    deviceDisplaySetting: 'Default' | 'Hostname' | 'IpAddress' | 'HostnameAndIpAddress';
    standardPen: PenPattern;
    lagPen: PenPattern;
    manualPen: PenPattern;
    associatedPen: PenPattern;
    multiPen: PenPattern;
    stpForwardingPen: PenPattern;
    stpBlockingPen: PenPattern;
}

interface PenPattern {
    color: {
        red: number;
        green: number;
        blue: number;
    };
    width: number;
    dashStyle: 'Solid' | 'Dash' | 'Dot' | 'DashDot' | 'DashDotDot';
}

export class TopoMapRequest {
    deviceGuids?: string[];
    primaryDeviceFilter?: DeviceFilter;
    connectedDeviceFilter?: DeviceFilter;
    layoutSettings: LayoutSettings;
    drawSettings: DrawSettings;

    constructor(
        layoutSettings: LayoutSettings,
        drawSettings: DrawSettings,
        deviceGuids?: string[],
        primaryDeviceFilter?: DeviceFilter,
        connectedDeviceFilter?: DeviceFilter
    ) {
        this.deviceGuids = deviceGuids;
        this.primaryDeviceFilter = primaryDeviceFilter;
        this.connectedDeviceFilter = connectedDeviceFilter;
        this.layoutSettings = layoutSettings;
        this.drawSettings = drawSettings;
    }
}

export function createTopoMapRequest(deviceGuids: string[]): TopoMapRequest {
    return new TopoMapRequest(
        {
            layoutType: 'Hierarchical',
            radialSettings: {
                minRadius: 0,
                maxRadius: 0,
                maxAngle: 0,
                maximizeRoot: true
            },
            hierarchicalSettings: {
                levelSpacing: 100,
                useStraightLinks: true,
                nodeSpacing: 100,
                layoutDirection: 'Down',
                rootAlignment: 'Center'
            },
            ringSettings: {
                minRadius: 0,
                maxRadius: 0,
                maxAngle: 0,
                maximizeRoot: true
            },
            showIpPhoneLinks: true,
            showLayer2Links: true,
            showLinkLabels: true,
            showVirtualLinks: true,
            showWirelessLinks: true,
            useStraightLinks: true
        },
        {
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
            deviceDisplaySetting: 'Default',
            standardPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            },
            lagPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            },
            manualPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            },
            associatedPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            },
            multiPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            },
            stpForwardingPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            },
            stpBlockingPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            }
        },
        deviceGuids
    );
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
        'mac_address' in obj &&
        typeof obj.mac_address === 'string' &&
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

// TopoMap
export interface TopoMap {
    layoutSettings: LayoutSettings;
    drawSettings: DrawSettings;
    deviceNodes: DeviceNode[];
    deviceGroupNodes: DeviceNode[];
    hubNodes: DeviceNode[];
    imageNodes: unknown; //TODO: Find out this typing. The example request was [].
    deviceLinks: DeviceLink[];
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    centerX: number;
    centerY: number;

    displayEdges?: unknown;
}

export function isTopoMap(obj: unknown): obj is TopoMap {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'layoutSettings' in obj &&
        isLayoutSettings(obj.layoutSettings) &&
        'drawSettings' in obj &&
        isDrawSettings(obj.drawSettings) &&
        'deviceNodes' in obj &&
        Array.isArray(obj.deviceNodes) &&
        'deviceGroupNodes' in obj &&
        Array.isArray(obj.deviceGroupNodes) &&
        'hubNodes' in obj &&
        Array.isArray(obj.hubNodes) &&
        'imageNodes' in obj &&
        Array.isArray(obj.imageNodes) && // Adjust the typing once known
        'deviceLinks' in obj &&
        Array.isArray(obj.deviceLinks) &&
        'width' in obj &&
        typeof obj.width === 'number' &&
        'height' in obj &&
        typeof obj.height === 'number' &&
        'left' in obj &&
        typeof obj.left === 'number' &&
        'right' in obj &&
        typeof obj.right === 'number' &&
        'top' in obj &&
        typeof obj.top === 'number' &&
        'bottom' in obj &&
        typeof obj.bottom === 'number' &&
        'centerX' in obj &&
        typeof obj.centerX === 'number' &&
        'centerY' in obj &&
        typeof obj.centerY === 'number' // &&
        // ('displayEdges' in obj ? isDisplayEdgeSet(obj.displayEdges) : true)
    );
}

export enum LayoutType {
    Manual,
    Radial,
    Hierarchical,
    Ring
}

export function isLayoutSettings(obj: unknown): obj is LayoutSettings {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'layoutType' in obj &&
        typeof obj.layoutType === 'number' &&
        Object.values(LayoutType).includes(obj.layoutType) &&
        'hierarchicalSettings' in obj &&
        (obj.hierarchicalSettings === null || isHierarchicalLayoutSettings(obj.hierarchicalSettings)) &&
        'radialSettings' in obj &&
        isRingRadialLayoutSettings(obj.radialSettings) &&
        'ringSettings' in obj &&
        isRingRadialLayoutSettings(obj.ringSettings) &&
        'useStraightLinks' in obj &&
        typeof obj.useStraightLinks === 'boolean' &&
        'showLinkLabels' in obj &&
        typeof obj.showLinkLabels === 'boolean' &&
        'showLayer2Links' in obj &&
        typeof obj.showLayer2Links === 'boolean' &&
        'showVirtualLinks' in obj &&
        typeof obj.showVirtualLinks === 'boolean' &&
        'showWirelessLinks' in obj &&
        typeof obj.showWirelessLinks === 'boolean' &&
        'showIpPhoneLinks' in obj &&
        typeof obj.showIpPhoneLinks === 'boolean' &&
        'rootNodes' in obj &&
        Array.isArray(obj.rootNodes)
    );
}

export enum LayoutDirection {
    Left,
    Right,
    Up,
    Down
}

export enum RootAlignment {
    Left,
    Center,
    Right
}

export interface HierarchicalLayoutSettings {
    levelSpacing: number;
    nodeSpacing: number;
    layoutDirection: LayoutDirection;
    rootAlignment: RootAlignment;
    useStraightLinks: boolean;
}

export function isHierarchicalLayoutSettings(obj: unknown): obj is HierarchicalLayoutSettings {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'levelSpacing' in obj &&
        typeof obj.levelSpacing === 'number' &&
        'nodeSpacing' in obj &&
        typeof obj.nodeSpacing === 'number' &&
        'layoutDirection' in obj &&
        typeof obj.layoutDirection === 'number' &&
        Object.values(LayoutDirection).includes(obj.layoutDirection) &&
        'rootAlignment' in obj &&
        typeof obj.rootAlignment === 'number' &&
        Object.values(RootAlignment).includes(obj.rootAlignment) &&
        'useStraightLinks' in obj &&
        typeof obj.useStraightLinks === 'boolean'
    );
}

export interface RingRadialLayoutSettings {
    minRadius: number;
    maxRadius: number;
    maxAngle: number;
    maximizeRoot: boolean;
}

export function isRingRadialLayoutSettings(obj: unknown): obj is RingRadialLayoutSettings {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'minRadius' in obj &&
        typeof obj.minRadius === 'number' &&
        'maxRadius' in obj &&
        typeof obj.maxRadius === 'number' &&
        'maxAngle' in obj &&
        typeof obj.maxAngle === 'number' &&
        'maximizeRoot' in obj &&
        typeof obj.maximizeRoot === 'boolean'
    );
}

export function isDrawSettings(obj: any): obj is DrawSettings {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'shortDeviceNames' in obj &&
        typeof obj.shortDeviceNames === 'boolean' &&
        'deviceTrimLeft' in obj &&
        typeof obj.deviceTrimLeft === 'boolean' &&
        'deviceTrimRight' in obj &&
        typeof obj.deviceTrimRight === 'boolean' &&
        'deviceTrimLeftChar' in obj &&
        typeof obj.deviceTrimLeftChar === 'string' &&
        'deviceTrimRightChar' in obj &&
        typeof obj.deviceTrimRightChar === 'string' &&
        'deviceTrimLeftCount' in obj &&
        typeof obj.deviceTrimLeftCount === 'number' &&
        'deviceTrimRightCount' in obj &&
        typeof obj.deviceTrimRightCount === 'number' &&
        'shortIfNames' in obj &&
        typeof obj.shortIfNames === 'boolean' &&
        'hideVendorImage' in obj &&
        typeof obj.hideVendorImage === 'boolean' &&
        'hidePlatformImage' in obj &&
        typeof obj.hidePlatformImage === 'boolean' &&
        'deviceDisplaySetting' in obj &&
        typeof obj.deviceDisplaySetting === 'number' &&
        'standardPen' in obj &&
        isPenPattern(obj.standardPen) &&
        'lagPen' in obj &&
        isPenPattern(obj.lagPen) &&
        'manualPen' in obj &&
        isPenPattern(obj.manualPen) &&
        'associatedPen' in obj &&
        isPenPattern(obj.associatedPen) &&
        'multiPen' in obj &&
        isPenPattern(obj.multiPen) &&
        'stpForwardingPen' in obj &&
        isPenPattern(obj.stpForwardingPen) &&
        'stpBlockingPen' in obj &&
        isPenPattern(obj.stpBlockingPen)
    );
}

export interface Color {
    red: number;
    green: number;
    blue: number;
}

export function isColor(obj: any): obj is Color {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'red' in obj &&
        typeof obj.red === 'number' &&
        'green' in obj &&
        typeof obj.green === 'number' &&
        'blue' in obj &&
        typeof obj.blue === 'number'
    );
}

export enum DashStyle {
    Solid = 0,
    Dash = 1,
    Dot = 2,
    DashDot = 3,
    DashDotDot = 4,
    Custom = 5
}

export function isPenPattern(obj: any): obj is PenPattern {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'color' in obj &&
        isColor(obj.color) &&
        'width' in obj &&
        typeof obj.width === 'number' &&
        'dashStyle' in obj &&
        typeof obj.dashStyle === 'number'
    );
}
