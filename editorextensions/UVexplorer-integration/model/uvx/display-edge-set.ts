import { TopoMap } from 'model/uvx/topo-map';
import { DeviceLink } from 'model/uvx/device';
import { DisplayEdge } from 'model/uvx/display-edge';

export class DisplayEdgeSet {
    map: Map<string, DisplayEdge>;

    constructor() {
        this.map = new Map<string, DisplayEdge>();
    }

    public get(nodeId1: number, nodeId2: number): DisplayEdge {
        const key1 = DisplayEdge.makeKey(nodeId1, nodeId2);
        const value1 = this.map.get(key1);
        if (value1 !== undefined) {
            return value1;
        }

        const key2 = DisplayEdge.makeKey(nodeId2, nodeId1);
        const value2 = this.map.get(key2);
        if (value2 !== undefined) {
            return value2;
        }

        const newValue = new DisplayEdge(nodeId1, nodeId2, []);
        this.map.set(key1, newValue);
        return newValue;
    }
}

export function isDisplayEdgeSet(obj: unknown): obj is DisplayEdgeSet {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        obj instanceof DisplayEdgeSet &&
        typeof obj.get === 'function'
    );
}


export function populateMapDisplayEdges(map: TopoMap): void {
    const dispEdges = new DisplayEdgeSet();

    map.deviceLinks.forEach((link: DeviceLink) => {
        link.linkEdges.forEach((edge) => {
            const dispEdge = dispEdges.get(edge.localConnection.nodeId, edge.remoteConnection.nodeId);
            dispEdge.deviceLinks.push(link);
        });
    });

    map.displayEdges = dispEdges;
}
