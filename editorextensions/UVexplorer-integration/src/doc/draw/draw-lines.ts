import { BlockProxy, LineProxy, LineShape, PageProxy, ZOrderOperation } from 'lucid-extension-sdk';
import { DeviceLink, DeviceLinkEdge } from 'model/uvx/device';
import { LINK_REFERENCE_KEY } from '@data/data-client';
import { PenPattern, DrawSettings, DashStyle } from 'model/uvx/topo-map';

export class DrawLines {
    static drawLines(
        page: PageProxy,
        deviceLinks: DeviceLink[],
        guidToBlockMap: Map<string, BlockProxy>,
        collectionId: string,
        drawSettings: DrawSettings
    ) {
        for (const link of deviceLinks) {
            for (const linkEdge of link.linkEdges) {
                const deviceBlock = guidToBlockMap.get(linkEdge.localConnection.deviceGuid);
                const connectedDeviceBlock = guidToBlockMap.get(linkEdge.remoteConnection.deviceGuid);

                if (deviceBlock && connectedDeviceBlock) {
                    const penSettings: PenPattern = this.getPenSettings(drawSettings, link.linkType);
                    let line: LineProxy;
                    if (deviceBlock.getBoundingBox().y > connectedDeviceBlock.getBoundingBox().y) {
                        line = this.drawLine(page, connectedDeviceBlock, deviceBlock, penSettings);
                    } else {
                        line = this.drawLine(page, deviceBlock, connectedDeviceBlock, penSettings);
                    }

                    this.setReferenceKey(line, linkEdge, collectionId);
                }
            }
        }
    }

    static drawLine(page: PageProxy, block1: BlockProxy, block2: BlockProxy, penSettings: PenPattern): LineProxy {
        const line = page.addLine({
            endpoint1: {
                connection: block1,
                linkX: 0.5,
                linkY: 0.5,
                style: 'none'
            },
            endpoint2: {
                connection: block2,
                linkX: 0.5,
                linkY: 0.5,
                style: 'none'
            }
        });
        line.setShape(LineShape.Diagonal);
        line.changeZOrder(ZOrderOperation.BOTTOM);
        line.properties.set('LineColor', this.toColorCode(penSettings.color.red, penSettings.color.green, penSettings.color.blue));
        line.properties.set('LineWidth', penSettings.width);
        line.properties.set('StrokeStyle', this.toStrokeStyle(penSettings.dashStyle));
        return line;
    }

    private static toColorCode(red: number, green: number, blue:  number) {
        return '#' + this.toHex(red) + this.toHex(green) + this.toHex(blue);
    }

    private static toHex(num: number): string {
        const map = '0123456789abcdef';
        let hex = '';
        hex += map.charAt(Math.floor(num / 16));
        hex += map.charAt(num % 16);
        return hex;
    }

    private static toStrokeStyle(dashStyle: DashStyle) {
        switch(dashStyle) {
            case 0: {
                return 'solid';
            }
            case 1: {
                return 'dashed';
            }
            case 2: {
                return 'dotted';
            }
            case 3: {
                return 'dashdot';
            }
            case 4: {
                return 'dashdotdot';
            }
            default: {
                console.error("Invalid dashStyle given");
                return 'solid';
            }
        }
    }

    static setReferenceKey(line: LineProxy, linkEdge: DeviceLinkEdge, collectionId: string) {
        line.setReferenceKey(LINK_REFERENCE_KEY, {
            collectionId: collectionId,
            primaryKey: `"${linkEdge.localConnection.deviceGuid}","${linkEdge.remoteConnection.deviceGuid}"`,
            readonly: true
        });
    }

    private static getPenSettings(drawSettings: DrawSettings, linkType: string): PenPattern {
        switch (linkType) {
            case 'LAG':
                return drawSettings.lagPen;
            case 'Manual':
                return drawSettings.manualPen;
            case 'Associated':
                return drawSettings.associatedPen;
            case 'Multi':
                return drawSettings.multiPen;
            default:
                return drawSettings.standardPen;
        }
    }

    static clearLines(page: PageProxy) {
        // TODO: only delete device connection lines not all lines
        const lines = page.allLines;
        if (lines) {
            for (const [, line] of lines) {
                line.delete();
            }
        }
    }
}
