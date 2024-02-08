import { DeviceNode } from './DeviceNode';
import { DeviceGroupNode } from './DeviceGroupNode';
import { HubNode } from './HubNode';
import { DeviceLink } from './DeviceLink';
import { DeviceLinkEdge } from './DeviceLinkEdge';
import { isLayoutSettings, LayoutSettings } from './LayoutSettings';
import { Point } from './Point';
import { MonitorState } from './DeviceConnection';

export interface TopoMap {
    layoutSettings: LayoutSettings;
    drawSettings: DrawSettings;
    deviceNodes: DeviceNode[];
    deviceGroupNodes: DeviceGroupNode[];
    hubNodes: HubNode[];
    deviceLinks: DeviceLink[];
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    centerX: number;
    centerY: number;

    displayEdges: DisplayEdgeSet;
}

export function isTopoMap(obj: unknown): obj is TopoMap {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'layoutSettings' in obj &&
        isLayoutSettings(obj.layoutSettings) &&
        'drawSettings' in obj &&
        isDrawSettings(obj.drawSettings) &&
        'deviceNodes' in obj &&
        Array.isArray(obj.deviceNodes) &&
        'deviceGroupNodes' in obj &&
        Array.isArray(obj.deviceGroupNodes) &&
        'hubNodes' in obj &&
        Array.isArray(obj.hubNodes) &&
        'deviceLinks' in obj &&
        Array.isArray(obj.deviceLinks) &&
        'width' in obj &&
        typeof obj.width === 'number' &&
        'height' in obj &&
        typeof obj.height === 'number' &&
        'left' in obj &&
        typeof obj.left === 'number' &&
        'right' in obj &&
        typeof obj.right === 'number' &&
        'top' in obj &&
        typeof obj.top === 'number' &&
        'bottom' in obj &&
        typeof obj.bottom === 'number' &&
        'centerX' in obj &&
        typeof obj.centerX === 'number' &&
        'centerY' in obj &&
        typeof obj.centerY === 'number' &&
        'displayEdges' in obj &&
        isDisplayEdgeSet(obj.displayEdges)
    );
}

export interface Color {
    red: number;
    green: number;
    blue: number;
}

export function isColor(obj: any): obj is Color {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'red' in obj &&
        typeof obj.red === 'number' &&
        'green' in obj &&
        typeof obj.green === 'number' &&
        'blue' in obj &&
        typeof obj.blue === 'number'
    );
}

export enum DashStyle {
    Solid = 0,
    Dash = 1,
    Dot = 2,
    DashDot = 3,
    DashDotDot = 4,
    Custom = 5
}

export interface PenPattern {
    color: Color;
    width: number;
    dashStyle: DashStyle;
}

export function isPenPattern(obj: any): obj is PenPattern {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'color' in obj &&
        isColor(obj.color) &&
        'width' in obj &&
        typeof obj.width === 'number' &&
        'dashStyle' in obj &&
        typeof obj.dashStyle === 'number'
    );
}

export interface DrawSettings {
    shortDeviceNames: boolean;
    deviceTrimLeft: boolean;
    deviceTrimRight: boolean;
    deviceTrimLeftChar: string;
    deviceTrimRightChar: string;
    deviceTrimLeftCount: number;
    deviceTrimRightCount: number;
    shortIfNames: boolean;

    standardPen: PenPattern;
    lagPen: PenPattern;
    manualPen: PenPattern;
    associatedPen: PenPattern;
    multiPen: PenPattern;
}

export function isDrawSettings(obj: any): obj is DrawSettings {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'shortDeviceNames' in obj &&
        typeof obj.shortDeviceNames === 'boolean' &&
        'deviceTrimLeft' in obj &&
        typeof obj.deviceTrimLeft === 'boolean' &&
        'deviceTrimRight' in obj &&
        typeof obj.deviceTrimRight === 'boolean' &&
        'deviceTrimLeftChar' in obj &&
        typeof obj.deviceTrimLeftChar === 'string' &&
        'deviceTrimRightChar' in obj &&
        typeof obj.deviceTrimRightChar === 'string' &&
        'deviceTrimLeftCount' in obj &&
        typeof obj.deviceTrimLeftCount === 'number' &&
        'deviceTrimRightCount' in obj &&
        typeof obj.deviceTrimRightCount === 'number' &&
        'shortIfNames' in obj &&
        typeof obj.shortIfNames === 'boolean' &&
        'standardPen' in obj &&
        isPenPattern(obj.standardPen) &&
        'lagPen' in obj &&
        isPenPattern(obj.lagPen) &&
        'manualPen' in obj &&
        isPenPattern(obj.manualPen) &&
        'associatedPen' in obj &&
        isPenPattern(obj.associatedPen) &&
        'multiPen' in obj &&
        isPenPattern(obj.multiPen)
    );
}

export class EffectiveDrawSettings {
    public color?: string;
    public width?: number;
    public lineDash?: number[];
}

export function isEffectiveDrawSettings(obj: any): obj is EffectiveDrawSettings {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'color' in obj &&
        typeof obj.color === 'string' &&
        'width' in obj &&
        typeof obj.width === 'number' &&
        'lineDash' in obj &&
        Array.isArray(obj.lineDash) &&
        obj.lineDash.every((u: unknown) => typeof u === 'number')
    );
}

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
    public pt1: Point;
    public pt2: Point;
    public deviceLinkEdges: DeviceLinkEdge[];
    public deviceLinks: DeviceLink[];
    public monitorState: MonitorState;
    private _effectiveDrawSettings: EffectiveDrawSettings | null | undefined;

    private static StatusLineWidth: number;
    private static UpPen: PenPattern;
    private static WarningPen: PenPattern;
    private static DownPen: PenPattern;
    private static OtherPen: PenPattern;

    constructor(private drawSettings: DrawSettings) {
        this.pt1 = { x: 0, y: 0 };
        this.pt2 = { x: 0, y: 0 };
        this.deviceLinkEdges = [];
        this.deviceLinks = [];
        this.monitorState = MonitorState.NoData;
        this._effectiveDrawSettings = null;

        if (!DisplayEdge.UpPen) {
            DisplayEdge.StatusLineWidth = 3;
            DisplayEdge.UpPen = {
                color: { red: 0, green: 255, blue: 0 },
                width: DisplayEdge.StatusLineWidth,
                dashStyle: DashStyle.Solid
            };
            DisplayEdge.WarningPen = {
                color: { red: 255, green: 255, blue: 0 },
                width: DisplayEdge.StatusLineWidth,
                dashStyle: DashStyle.Solid
            };
            DisplayEdge.DownPen = {
                color: { red: 255, green: 0, blue: 0 },
                width: DisplayEdge.StatusLineWidth,
                dashStyle: DashStyle.Solid
            };
            DisplayEdge.OtherPen = {
                color: { red: 0, green: 0, blue: 255 },
                width: DisplayEdge.StatusLineWidth,
                dashStyle: DashStyle.Solid
            };
        }
    }

    public get key(): string {
        return DisplayEdge.makeKey(this.pt1, this.pt2);
    }

    public static makeKey(pt1: Point, pt2: Point): string {
        return pt1.x + '-' + pt1.y + '-' + pt2.x + '-' + pt2.y;
    }

    public get effectiveDrawSettings(): EffectiveDrawSettings {
        if (!this._effectiveDrawSettings) {
            this._effectiveDrawSettings = new EffectiveDrawSettings();
            this.setEffectivePenPattern(this._effectiveDrawSettings, this.type);
        }
        return this._effectiveDrawSettings;
    }

    public clearEffectiveDrawSettings(): void {
        this._effectiveDrawSettings = undefined;
    }

    private setEffectivePenPattern(settings: EffectiveDrawSettings, type: DisplayEdgeType): void {
        let penPattern: PenPattern | null = null;

        if (this.monitorState == MonitorState.NoData) {
            switch (this.type) {
                case DisplayEdgeType.Associated:
                    penPattern = this.drawSettings.associatedPen;
                    break;
                case DisplayEdgeType.Lag:
                    penPattern = this.drawSettings.lagPen;
                    break;
                case DisplayEdgeType.Manual:
                    penPattern = this.drawSettings.manualPen;
                    break;
                case DisplayEdgeType.Multi:
                    penPattern = this.drawSettings.multiPen;
                    break;
                case DisplayEdgeType.Standard:
                    penPattern = this.drawSettings.standardPen;
                    break;
                default:
                    console.assert(false);
                    penPattern = this.drawSettings.standardPen;
                    break;
            }
        } else {
            switch (this.monitorState) {
                case MonitorState.Up:
                    penPattern = DisplayEdge.UpPen;
                    break;
                case MonitorState.Warning:
                    penPattern = DisplayEdge.WarningPen;
                    break;
                case MonitorState.Down:
                    penPattern = DisplayEdge.DownPen;
                    break;
                default:
                    penPattern = DisplayEdge.OtherPen;
                    break;
            }
        }

        settings.color = DisplayEdge.toColorString(penPattern.color);
        settings.width = penPattern.width;
        settings.lineDash = DisplayEdge.toDashStyle(penPattern.dashStyle);
    }

    private get type(): DisplayEdgeType {
        let linkType = this.deviceLinks[0].linkType.toLowerCase();

        if (this.deviceLinks.length > 1) {
            if (!this.allLagLinks) {
                linkType = 'multi';
            }
        }

        switch (linkType) {
            case 'manual':
                return DisplayEdgeType.Manual;
            case 'lag':
                return DisplayEdgeType.Lag;
            case 'associated':
                return DisplayEdgeType.Associated;
            case 'multi':
                return DisplayEdgeType.Multi;
            default:
                return DisplayEdgeType.Standard;
        }
    }

    private get allLagLinks(): boolean {
        return this.deviceLinks.every((link) => link.linkType.toLowerCase() == 'lag');
    }

    public static toColorString(color: Color): string {
        return '#' + this.toHexString(color.red) + this.toHexString(color.green) + this.toHexString(color.blue);
    }

    public static fromColorString(str: string): Color {
        let redStr = str.substr(1, 2);
        let greenStr = str.substr(3, 2);
        let blueStr = str.substr(5, 2);

        let red = this.fromHexString(redStr);
        let green = this.fromHexString(greenStr);
        let blue = this.fromHexString(blueStr);

        return { red: red, green: green, blue: blue };
    }

    private static fromHexString(s: string): number {
        return parseInt(s, 16);
    }

    private static toHexString(n: number): string {
        let result: string = n.toString(16);
        switch (result.length) {
            case 0:
                return '00';
            case 1:
                return '0' + result;
            default:
                return result;
        }
    }

    public static toDashStyle(dashStyle: DashStyle): number[] {
        const Dash = 10;
        const Dot = 5;

        switch (dashStyle) {
            case DashStyle.Custom:
                return [];
            case DashStyle.Dash:
                return [Dash, Dot];
            case DashStyle.Dot:
                return [Dot, Dot];
            case DashStyle.DashDot:
                return [Dash, Dot, Dot, Dot];
            case DashStyle.DashDotDot:
                return [Dash, Dot, Dot, Dot, Dot, Dot];
            case DashStyle.Solid:
                return [];
            default:
                console.assert(false);
                return [];
        }
    }
}

export class DisplayEdgeSet {
    private map: Map<string, DisplayEdge>;

    constructor(private drawSettings: DrawSettings) {
        this.map = new Map<string, DisplayEdge>();
    }

    public get(pt1: Point, pt2: Point): DisplayEdge {
        let key1 = DisplayEdge.makeKey(pt1, pt2);
        let value1 = this.map.get(key1);
        if (value1 !== undefined) {
            return value1;
        }

        let key2 = DisplayEdge.makeKey(pt2, pt1);
        let value2 = this.map.get(key2);
        if (value2 !== undefined) {
            return value2;
        }

        let newValue = new DisplayEdge(this.drawSettings);
        newValue.pt1 = { x: pt1.x, y: pt1.y };
        newValue.pt2 = { x: pt2.x, y: pt2.y };
        this.map.set(key1, newValue);
        return newValue;
    }

    public forEach(f: (d: DisplayEdge) => void): void {
        for (const key in this.map) {
            const val = this.map.get(key);
            if (val !== undefined) {
                f(val);
            }
        }
    }

    public some(f: (d: DisplayEdge) => boolean): boolean {
        for (const key in this.map) {
            const val = this.map.get(key);
            if (val !== undefined) {
                if (f(val)) {
                    return true;
                }
            }
        }
        return false;
    }
}

export function isDisplayEdgeSet(obj: unknown): obj is DisplayEdgeSet {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        obj instanceof DisplayEdgeSet &&
        typeof obj.get === 'function' &&
        typeof obj.forEach === 'function' &&
        typeof obj.some === 'function'
    );
}
