import {BlockProxy, LineProxy, LineShape} from "lucid-extension-sdk";
import {DeviceLink} from "model/uvx/device";
import {LINK_REFERENCE_KEY} from "@data/data";

export class Line {
    static drawLines(deviceLinks: DeviceLink[], guidToBlockMap: Map<string, BlockProxy>, collectionId: string) {
        for (const link of deviceLinks) {
            for (const linkEdge of link.linkEdges) {
                const deviceBlock = guidToBlockMap.get(linkEdge.localConnection.deviceGuid);
                const connectedDeviceBlock = guidToBlockMap.get(linkEdge.remoteConnection.deviceGuid);

                if (deviceBlock && connectedDeviceBlock) {
                    let line: LineProxy;
                    if (deviceBlock.getBoundingBox().y > connectedDeviceBlock.getBoundingBox().y) {
                        line = this.drawLine(connectedDeviceBlock, deviceBlock);
                    } else {
                        line = this.drawLine(deviceBlock, connectedDeviceBlock);
                    }

                    line.setReferenceKey(LINK_REFERENCE_KEY, {
                        collectionId: collectionId,
                        primaryKey: `"${linkEdge.localConnection.deviceGuid}","${linkEdge.remoteConnection.deviceGuid}"`,
                        readonly: true
                    });
                }
            }
        }
    }

    static drawLine(block1: BlockProxy, block2: BlockProxy): LineProxy {
        const line = block1.getPage().addLine({
            endpoint1: {
                connection: block1,
                linkX: 0.5,
                linkY: 1,
                style: 'none'
            },
            endpoint2: {
                connection: block2,
                linkX: 0.5,
                linkY: 0,
                style: 'none'
            }
        });
        line.setShape(LineShape.Diagonal);
        return line;
    }
}
