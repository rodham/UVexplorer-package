import {BlockProxy, LineProxy, LineShape, PageProxy} from "lucid-extension-sdk";
import {DeviceLink, DeviceLinkEdge} from "model/uvx/device";
import {LINK_REFERENCE_KEY} from "@data/data";

export class DrawLines {
    static drawLines(page: PageProxy, deviceLinks: DeviceLink[], guidToBlockMap: Map<string, BlockProxy>, collectionId: string) {
        for (const link of deviceLinks) {
            for (const linkEdge of link.linkEdges) {
                const deviceBlock = guidToBlockMap.get(linkEdge.localConnection.deviceGuid);
                const connectedDeviceBlock = guidToBlockMap.get(linkEdge.remoteConnection.deviceGuid);

                if (deviceBlock && connectedDeviceBlock) {
                    let line: LineProxy;
                    if (deviceBlock.getBoundingBox().y > connectedDeviceBlock.getBoundingBox().y) {
                        line = this.drawLine(page, connectedDeviceBlock, deviceBlock);
                    } else {
                        line = this.drawLine(page, deviceBlock, connectedDeviceBlock);
                    }

                    this.setReferenceKey(line, linkEdge, collectionId);
                }
            }
        }
    }

    static drawLine(page: PageProxy, block1: BlockProxy, block2: BlockProxy): LineProxy {
        const line = page.addLine({
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

    static setReferenceKey(line: LineProxy, linkEdge: DeviceLinkEdge, collectionId: string) {
        line.setReferenceKey(LINK_REFERENCE_KEY, {
            collectionId: collectionId,
            primaryKey: `"${linkEdge.localConnection.deviceGuid}","${linkEdge.remoteConnection.deviceGuid}"`,
            readonly: true
        });
    }
}
