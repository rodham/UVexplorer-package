export interface DeviceCategoryListResponse {
    device_categories: string[];
}

export function isDeviceCategoryListResponse(data: unknown): data is DeviceCategoryListResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'device_categories' in data &&
        Array.isArray(data.device_categories) &&
        data.device_categories.every((category: unknown) => typeof category === 'string')
    );
}

export interface InfoSet {
    name: string;
    description: string;
}

export interface InfoSetListResponse {
    info_sets: InfoSet[];
}

export function isInfoSetListResponse(data: unknown): data is InfoSetListResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'info_sets' in data &&
        Array.isArray(data.info_sets) &&
        data.info_sets.every((infoSet: unknown) => typeof infoSet === 'object' && infoSet !== null)
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

export function isNetworkSummariesResponse(data: unknown): data is NetworkSummariesResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'network_summaries' in data &&
        Array.isArray(data.network_summaries) &&
        data.network_summaries.every((summary: unknown) => typeof summary === 'object' && summary !== null)
    );
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
    category_filter_type: "All" | "Any";
    category_names: string[];
}

export class DeviceFilter {
    include_scope: "NoDevices" | "AllDevices" | "AllNetworkDevices" | "AllSnmpDevices";
    device_names?: string[];
    ip_scopes?: IpScope[];
    device_categories?: DeviceCategoryFilter;
    vlans?: string[];
    system_oids?: string[];

    constructor(data: {
        include_scope: "NoDevices" | "AllDevices" | "AllNetworkDevices" | "AllSnmpDevices";
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

interface DeviceClass {
    collector_profile: {
        entries: CollectorProfileEntry[];
    };
}

interface DeviceCategoryEntry {
    device_category: string;
    source_name: string;
}

interface DeviceCategories {
    entries: DeviceCategoryEntry[];
}

interface ProtocolProfileEntry {
    protocol_name: string;
    protocol_settings: unknown;
}

interface ProtocolProfile {
    entries: ProtocolProfileEntry[];
}

export interface DeviceListResponse {
    devices: Device[];
}

export function isDeviceListResponse(data: unknown): data is DeviceListResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'devices' in data &&
        Array.isArray(data.devices) &&
        data.devices.every((device: unknown) => typeof device === 'object' && device !== null)
    );
}

export interface Device {
    ip_address: string;
    mac_address: string;
    guid: string;
    info_sets: unknown;
    device_class: DeviceClass;
    device_categories: DeviceCategories;
    protocol_profile: ProtocolProfile;
    timestamp: string;
}
