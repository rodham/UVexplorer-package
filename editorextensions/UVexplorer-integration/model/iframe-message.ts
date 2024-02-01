import { NetworkSummary } from './uvexplorer-model';

export interface LoadNetworkMessage {
    action: 'loadNetwork';
    network_guid: string;
}

export function isLoadNetworkMessage(message: unknown): message is LoadNetworkMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        'network_guid' in message &&
        typeof message.action === 'string' &&
        message.action === 'loadNetwork' &&
        typeof message.network_guid === 'string'
    );
}

export interface ListNetworksMessage {
    action: 'listNetworks';
    network_summaries: NetworkSummary[]
}

export function isListNetworksMessage(message: unknown): message is ListNetworksMessage {
    return (
        typeof message === 'object' &&
        message !== null &&
        'action' in message &&
        'network_summaries' in message &&
        typeof message.action === 'string' &&
        message.action === 'listNetworks' &&
        Array.isArray(message.network_summaries) &&
        message.network_summaries.every((networkSummary: unknown) => typeof networkSummary === 'object' && networkSummary !== null)
    );
}
