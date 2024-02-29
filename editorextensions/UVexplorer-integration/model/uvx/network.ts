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
