export interface HubNode {
    nodeId: number;
    label: string;
    x: number;
    y: number;
    centerX: number;
    bottom: number;
    width: number;
    height: number;
    type: MultiNodeType;
}

export function isHubNode(obj: unknown): obj is HubNode {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'nodeId' in obj &&
        typeof obj.nodeId === 'number' &&
        'label' in obj &&
        typeof obj.label === 'string' &&
        'x' in obj &&
        typeof obj.x === 'number' &&
        'y' in obj &&
        typeof obj.y === 'number' &&
        'centerX' in obj &&
        typeof obj.centerX === 'number' &&
        'bottom' in obj &&
        typeof obj.bottom === 'number' &&
        'width' in obj &&
        typeof obj.width === 'number' &&
        'height' in obj &&
        typeof obj.height === 'number' &&
        'type' in obj &&
        typeof obj.type === 'number' &&
        Object.values(MultiNodeType).includes(obj.type)
    );
}

export enum MultiNodeType {
    Hub,
    WirelessClient,
    VirtualPortGroup
}

export class HubNodeUtil {
     static getCategoryImageKey(node: HubNode): string {
        switch (node.type) {
            case MultiNodeType.VirtualPortGroup:
                return 'virtual-port-group';
            case MultiNodeType.WirelessClient:
                return 'wireless-client';
            default:
                return 'net-device';
        }
    }
}
