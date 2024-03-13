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
