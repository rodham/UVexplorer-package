export interface ListNetworksMessage {
    action: 'listNetworks';
    network_summaries: string;
}

export function isListNetworksMessage(message: unknown): message is ListNetworksMessage {
    return (
        (typeof message === 'object' &&
        message !== null) &&
        ('action' in message &&
        typeof message.action === 'string' &&
        message.action === 'listNetworks') &&
        ('network_summaries' in message &&
        typeof message.network_summaries === 'string')
    );
}

export interface LoadNetworkMessage {
    action: 'loadNetwork'
    network_guid: string;
}

export function isLoadNetworkMessage(message: unknown): message is LoadNetworkMessage {
    return (
        (typeof message === 'object' &&
            message !== null) &&
        ('action' in message &&
            typeof message.action === 'string' &&
            message.action === 'loadNetwork') &&
        ('network_guid' in message &&
            typeof message.network_guid === 'string')
    );
}

