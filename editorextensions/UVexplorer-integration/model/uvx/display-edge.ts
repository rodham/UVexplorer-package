import { DeviceLink, isDeviceLink } from 'model/uvx/device';

export enum DisplayEdgeType {
    Standard,
    Lag,
    Manual,
    Associated,
    Multi
}

// Represents an edge as displayed on the screen
// (each DisplayEdge is associated with one or more DeviceLinkEdges)
export class DisplayEdge {
    public nodeId1: number;
    public nodeId2: number;
    public deviceLinks: DeviceLink[];

    constructor(nodeId1: number, nodeId2: number, deviceLinks: DeviceLink[]) {
        this.nodeId1 = nodeId1;
        this.nodeId2 = nodeId2;
        this.deviceLinks = deviceLinks;
    }

    public get key(): string {
        return DisplayEdge.makeKey(this.nodeId1, this.nodeId2);
    }

    public static makeKey(nodeId1: number, nodeId2: number): string {
        return nodeId1 + '-' + nodeId2;
    }
}

export function isDisplayEdge(obj: unknown): obj is DisplayEdge {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'nodeId1' in obj &&
        typeof obj.nodeId1 === 'number' &&
        'nodeId2' in obj &&
        typeof obj.nodeId2 === 'number' &&
        'deviceLinks' in obj &&
        Array.isArray(obj.deviceLinks) &&
        obj.deviceLinks.every((link) => isDeviceLink(link))
    );
}
