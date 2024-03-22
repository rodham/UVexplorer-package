import { BlockProxy, LineProxy, LineShape, PageProxy, ZOrderOperation } from 'lucid-extension-sdk';
import { DISPLAY_EDGE_REFERENCE_KEY } from '@data/data-client';
import { PenPattern, DrawSettings, DashStyle } from 'model/uvx/topo-map';
import { DisplayEdge } from 'model/uvx/display-edge';
import { DisplayEdgeSet } from 'model/uvx/display-edge-set';

export class DrawLines {
    static drawLines(
        page: PageProxy,
        displayEdgeSet: DisplayEdgeSet,
        idToBlockMap: Map<number, BlockProxy>,
        collectionId: string,
        drawSettings: DrawSettings
    ) {
        for (const displayEdge of displayEdgeSet.map.values()) {
            if (displayEdge.deviceLinks[0]) {
                // Only draw one line, no matter how many links there are between two nodes
                const deviceBlock = idToBlockMap.get(displayEdge.nodeId1);
                const connectedDeviceBlock = idToBlockMap.get(displayEdge.nodeId2);

                if (deviceBlock && connectedDeviceBlock) {
                    const penSettings: PenPattern = this.getPenSettings(
                        drawSettings,
                        displayEdge.deviceLinks[0].linkType
                    );
                    const line = this.drawLine(page, deviceBlock, connectedDeviceBlock, penSettings);
                    this.setReferenceKey(line, displayEdge, collectionId);
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
        if (line.properties !== undefined) {
            line.properties.set(
                'LineColor',
                this.toColorCode(penSettings.color.red, penSettings.color.green, penSettings.color.blue)
            );
            line.properties.set('LineWidth', penSettings.width);
            line.properties.set('StrokeStyle', this.toStrokeStyle(penSettings.dashStyle));
        }
        return line;
    }

    private static toColorCode(red: number, green: number, blue: number) {
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
        switch (dashStyle) {
            case DashStyle.Solid: {
                return 'solid';
            }
            case DashStyle.Dash: {
                return 'dashed';
            }
            case DashStyle.Dot: {
                return 'dotted';
            }
            case DashStyle.DashDot: {
                return 'dashdot';
            }
            case DashStyle.DashDotDot: {
                return 'dashdotdot';
            }
            default: {
                console.error('Invalid dashStyle given');
                return 'solid';
            }
        }
    }

    static setReferenceKey(line: LineProxy, displayEdge: DisplayEdge, collectionId: string) {
        line.setReferenceKey(DISPLAY_EDGE_REFERENCE_KEY, {
            collectionId: collectionId,
            primaryKey: `${displayEdge.nodeId1},${displayEdge.nodeId2}`,
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
