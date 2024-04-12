import { BlockProxy, LineProxy, LineShape, PageProxy, ZOrderOperation } from 'lucid-extension-sdk';
import { DISPLAY_EDGE_REFERENCE_KEY } from '@data/data-client';
import { PenPattern, DrawSettings, DashStyle } from 'model/uvx/topo-map';
import { DisplayEdge } from 'model/uvx/display-edge';
import { DisplayEdgeSet } from 'model/uvx/display-edge-set';
import { DeviceLink } from 'model/uvx/device';

export class DrawLines {
    /**
     * Places all DisplayEdges on the map with the specified draw and label settings
     * Adds references for DisplayEdges in the display edge data collection for the current network
     */
    static drawLines(
        page: PageProxy,
        displayEdgeSet: DisplayEdgeSet,
        idToBlockMap: Map<number, BlockProxy>,
        collectionId: string,
        drawSettings: DrawSettings,
        showLinkLabels: boolean
    ) {
        for (const displayEdge of displayEdgeSet.map.values()) {
            if (displayEdge.deviceLinks[0]) {
                // Only draw one line, no matter how many links there are between two nodes
                const deviceBlock = idToBlockMap.get(displayEdge.nodeId1);
                const connectedDeviceBlock = idToBlockMap.get(displayEdge.nodeId2);

                if (deviceBlock && connectedDeviceBlock) {
                    const penSettings: PenPattern = this.getPenSettings(drawSettings, displayEdge);

                    const lineLabel = showLinkLabels ? this.createLinkLabel(displayEdge) : '';
                    const line = this.drawLine(page, deviceBlock, connectedDeviceBlock, penSettings, lineLabel);
                    this.setReferenceKey(line, displayEdge, collectionId);
                }
            }
        }
    }

    /**
     * Places a single line on the map between two blocks
     */
    static drawLine(
        page: PageProxy,
        block1: BlockProxy,
        block2: BlockProxy,
        penSettings: PenPattern,
        lineLabel: string
    ): LineProxy {
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

        line.addTextArea(lineLabel, { location: 0.5, side: 0 });
        if (line.textStyles?.keys() !== undefined) {
            for (const key of line.textStyles.keys()) {
                const styles = line.textStyles.get(key);
                styles.size = 5;
                void line.textStyles.set('t0', styles);
            }
        }

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

    /**
     * Converts RGB values into a hexadecimal color code
     */
    private static toColorCode(red: number, green: number, blue: number) {
        return '#' + this.toHex(red) + this.toHex(green) + this.toHex(blue);
    }

    /**
     * Converts a single RGB value into a hexadecimal value
     */
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

    private static getPenSettings(drawSettings: DrawSettings, displayEdge: DisplayEdge): PenPattern {
        if (displayEdge.deviceLinks[0].linkType?.toLowerCase() === undefined) {
            return drawSettings.standardPen;
        }

        let linkType = displayEdge.deviceLinks[0].linkType.toLowerCase();

        if (displayEdge.deviceLinks.length > 1) {
            if (!this.allLagLinks(displayEdge.deviceLinks)) {
                linkType = 'multi';
            }
        }

        switch (linkType) {
            case 'lag':
                return drawSettings.lagPen;
            case 'manual':
                return drawSettings.manualPen;
            case 'associated':
                return drawSettings.associatedPen;
            case 'multi':
                return drawSettings.multiPen;
            default:
                return drawSettings.standardPen;
        }
    }

    private static allLagLinks(deviceLinks: DeviceLink[]): boolean {
        return deviceLinks.every((link) => {
            if (link.linkType?.toLowerCase() === undefined) {
                return false;
            }
            return link.linkType.toLowerCase() === 'lag';
        });
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

    private static createLinkLabel(displayEdge: DisplayEdge) {
        let label = '';
        for (const link of displayEdge.deviceLinks) {
            for (const edge of link.linkEdges) {
                for (const localLabel of edge.localConnection.interfaceLabels) {
                    if (localLabel && localLabel.trim() !== '') {
                        if (label != '') {
                            label += ', ';
                        }
                        label += localLabel;
                    }
                }

                for (const remoteLabel of edge.remoteConnection.interfaceLabels) {
                    if (remoteLabel && remoteLabel.trim() !== '') {
                        if (label !== '') {
                            label += ', ';
                        }
                        label += remoteLabel;
                    }
                }
            }
        }
        return label;
    }
}
