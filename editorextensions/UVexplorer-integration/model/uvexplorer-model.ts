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
