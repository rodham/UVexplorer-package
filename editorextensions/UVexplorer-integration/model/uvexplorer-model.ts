export class SessionInfo {
    serverUrl: string;
    sessionGuid: string;
    networkGuid: string;

    constructor(serverUrl: string, sessionGuid: string, networkGuid: string) {
        this.serverUrl = serverUrl;
        this.sessionGuid = sessionGuid;
        this.networkGuid = networkGuid;
    }
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

export class NetworkSummariesResponse {
    network_summaries: NetworkSummary[];

    constructor(network_summaries: NetworkSummary[]) {
        this.network_summaries = network_summaries;
    }
}

export class NetworkSummary {
    guid: string;
    created_time: string;
    modified_time: string;
    name: string;
    description: string;
    agent_summaries: AgentSummary[];

    constructor(
        guid: string,
        created_time: string,
        modified_time: string,
        name: string,
        description: string,
        agent_summaries: AgentSummary[]
    ) {
        this.guid = guid;
        this.created_time = created_time;
        this.modified_time = modified_time;
        this.name = name;
        this.description = description;
        this.agent_summaries = agent_summaries;
    }
}

export class AgentSummary {
    guid: string;
    created_time: string;
    modified_time: string;
    name: string;
    description: string;
    discovery_summaries: DiscoverySummary[];

    constructor(
        guid: string,
        created_time: string,
        modified_time: string,
        name: string,
        description: string,
        discovery_summaries: DiscoverySummary[]
    ) {
        this.guid = guid;
        this.created_time = created_time;
        this.modified_time = modified_time;
        this.name = name;
        this.description = description;
        this.discovery_summaries = discovery_summaries;
    }
}

export class DiscoverySummary {
    guid: string;
    created_time: string;
    modified_time: string;
    name: string;
    discovery_run_summaries: DiscoveryRunSummary[];

    constructor(
        guid: string,
        created_time: string,
        modified_time: string,
        name: string,
        discovery_run_summaries: DiscoveryRunSummary[]
    ) {
        this.guid = guid;
        this.created_time = created_time;
        this.modified_time = modified_time;
        this.name = name;
        this.discovery_run_summaries = discovery_run_summaries;
    }
}

export class DiscoveryRunSummary {
    guid: string;
    start_time: string;
    end_time: string;

    constructor(guid: string, start_time: string, end_time: string) {
        this.guid = guid;
        this.start_time = start_time;
        this.end_time = end_time;
    }
}

// DeviceFilter
interface IpScope {
    start_ip: string;
    end_ip: string;
}

interface DeviceCategoryFilter {
    category_filter_type: string;
    category_names: string[];
}

export class DeviceFilter {
    include_scope: string;
    device_names?: string[];
    ip_scopes?: IpScope[];
    device_categories?: DeviceCategoryFilter;
    vlans?: string[];
    system_oids?: string[];

    constructor(
        include_scope: string,
        device_names?: string[],
        ip_scopes?: IpScope[],
        device_categories?: DeviceCategoryFilter,
        vlans?: string[],
        system_oids?: string[]
    ) {
        this.include_scope = include_scope;
        this.device_names = device_names;
        this.ip_scopes = ip_scopes;
        this.device_categories = device_categories;
        this.vlans = vlans;
        this.system_oids = system_oids;
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

export interface DeviceCategoryEntry {
    device_category: string;
    source_name: string;
}

export interface DeviceCategories {
    entries: DeviceCategoryEntry[];
}

// interface ProtocolSettings {
//   // Details depend on the protocol
// }

interface ProtocolProfileEntry {
    protocol_name: string;
    protocol_settings: unknown;
}

interface ProtocolProfile {
    entries: ProtocolProfileEntry[];
}

export class DeviceListResponse {
    devices: Device[];
    constructor(devices: Device[]) {
        this.devices = devices;
    }
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

    constructor(
        ip_address: string,
        mac_address: string,
        guid: string,
        info_sets: unknown,
        device_class: DeviceClass,
        device_categories: DeviceCategories,
        protocol_profile: ProtocolProfile,
        timestamp: string
    ) {
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
