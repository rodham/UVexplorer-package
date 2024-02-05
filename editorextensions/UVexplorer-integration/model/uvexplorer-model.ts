export interface DeviceDetailsResponse {
    deviceGuid: string;
    displayName: string;
    infoSets: DeviceDetailsInfoSet[];
}

interface DeviceDetailsInfoSet {
    infoSetName: string;
    title: string;
    columns: Column[];
    entries: Entry[];
}

interface Column {
    field: string;
    header: string;
    type: string;
    visible: boolean;
}

interface Entry {
    groupKey: string;
    values: Value[];
}

interface Value {
    value: string;
    tagText: string;
}

export interface DeviceCategoryListResponse {
    device_categories: string[];
}

export interface InfoSet {
    name: string;
    description: string;
}

export interface InfoSetListResponse {
    info_sets: InfoSet[];
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

export interface NetworkSummary {
    guid: string;
    created_time: string;
    modified_time: string;
    name: string;
    description: string;
    agent_summaries: AgentSummary[];
}

interface AgentSummary {
    guid: string;
    created_time: string;
    modified_time: string;
    name: string;
    description: string;
    discovery_summaries: DiscoverySummary[];
}

interface DiscoverySummary {
    guid: string;
    created_time: string;
    modified_time: string;
    name: string;
    discovery_run_summaries: DiscoveryRunSummary[];
}

interface DiscoveryRunSummary {
    guid: string;
    start_time: string;
    end_time: string;
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

    constructor(device_guids: string[], device_filter: DeviceFilter, info_set_names: string[]) {
        this.device_guids = device_guids;
        this.device_filter = device_filter;
        this.info_set_names = info_set_names;
    }
}

// TopoMapRequest
interface LayoutSettings {
    layoutType: "Manual" | "Radial" | "Hierarchical" | "Ring";
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
        layoutDirection: "Left" | "Right" | "Up" | "Down";
        rootAlignment: "Left" | "Center" | "Right";
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
    deviceDisplaySetting: "Default" | "Hostname" | "IpAddress" | "HostnameAndIpAddress";
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
    dashStyle: "Solid" | "Dash" | "Dot" | "DashDot" | "DashDotDot";
}

export class TopoMapRequest {
    deviceGuids?: string[];
    primaryDeviceFilter?: DeviceFilter;
    connectedDeviceFilter?: DeviceFilter;
    layoutSettings: LayoutSettings;
    drawSettings: DrawSettings;


    constructor(deviceGuids: string[], primaryDeviceFilter: DeviceFilter, connectedDeviceFilter: DeviceFilter, layoutSettings: LayoutSettings, drawSettings: DrawSettings) {
        this.deviceGuids = deviceGuids;
        this.primaryDeviceFilter = primaryDeviceFilter;
        this.connectedDeviceFilter = connectedDeviceFilter;
        this.layoutSettings = layoutSettings;
        this.drawSettings = drawSettings;
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

export interface DeviceClass {
    collector_profile: {
        entries: CollectorProfileEntry[];
    };
}

interface DeviceCategoryEntry {
    device_category: string;
    source_name: string;
}

export interface DeviceCategories {
    entries: DeviceCategoryEntry[];
}

interface ProtocolProfileEntry {
    protocol_name: string;
    protocol_settings: unknown;
}

export interface ProtocolProfile {
    entries: ProtocolProfileEntry[];
}

export interface DeviceListResponse {
    devices: Device[];
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

    constructor(ip_address: string, mac_address: string, guid: string, info_sets: unknown, device_class: DeviceClass, device_categories: DeviceCategories, protocol_profile: ProtocolProfile, timestamp: string) {
        this.ip_address = ip_address;
        this.mac_address = mac_address;
        this.guid = guid;
        this.info_sets = info_sets;
        this.device_class = device_class;
        this.device_categories = device_categories;
        this.protocol_profile = protocol_profile;
        this.timestamp = timestamp;
    }
}
