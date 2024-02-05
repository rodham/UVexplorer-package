import { DeviceNode } from './DeviceNode';
import { DeviceGroupNode } from './DeviceGroupNode';
import { HubNode } from './HubNode';
import { DeviceLink } from './DeviceLink';
import { DeviceLinkEdge } from './DeviceLinkEdge';
import { LayoutSettings } from './LayoutSettings';
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
        'green' in obj &&
        'blue' in obj &&
        typeof obj.red === 'number' &&
        typeof obj.green === 'number' &&
        typeof obj.blue === 'number'
    );
}


export enum DashStyle {
	Solid = 0,
	Dash = 1,
	Dot = 2,
	DashDot = 3,
	DashDotDot = 4,
	Custom = 5,
};



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
        'deviceTrimLeft' in obj &&
        'deviceTrimRight' in obj &&
        'deviceTrimLeftChar' in obj &&
        'deviceTrimRightChar' in obj &&
        'deviceTrimLeftCount' in obj &&
        'deviceTrimRightCount' in obj &&
        'shortIfNames' in obj &&
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
	public color: string;
	public width: number;
	public lineDash: number[];

    constructor(color: string = 'black', width: number = 1, lineDash: number[] = [1]) {
        this.color = color;
        this.width = width;
        this.lineDash = lineDash;
    }
}

export enum DisplayEdgeType {
	Standard,
	Lag,
	Manual,
	Associated,
	Multi,
}


// Represents an edge as displayed on the screen
// (each DisplayEdge is associated with one or more DeviceLinkEdges)
export class DisplayEdge {
	public pt1: Point;
	public pt2: Point;
	public deviceLinkEdges: DeviceLinkEdge[];
	public deviceLinks: DeviceLink[];
	public monitorState: MonitorState;
	private _effectiveDrawSettings?: EffectiveDrawSettings;


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
		this._effectiveDrawSettings = undefined;

		if (!DisplayEdge.UpPen) {
			DisplayEdge.StatusLineWidth = 3;
			DisplayEdge.UpPen = {
				color: { red: 0, green: 255, blue: 0 },
				width: DisplayEdge.StatusLineWidth,
				dashStyle: DashStyle.Solid,
			};
			DisplayEdge.WarningPen = {
				color: { red: 255, green: 255, blue: 0 },
				width: DisplayEdge.StatusLineWidth,
				dashStyle: DashStyle.Solid,
			};
			DisplayEdge.DownPen = {
				color: { red: 255, green: 0, blue: 0 },
				width: DisplayEdge.StatusLineWidth,
				dashStyle: DashStyle.Solid,
			};
			DisplayEdge.OtherPen = {
				color: { red: 0, green: 0, blue: 255 },
				width: DisplayEdge.StatusLineWidth,
				dashStyle: DashStyle.Solid,
			};
		}
	}

	public get key(): string {
		return DisplayEdge.makeKey(this.pt1, this.pt2);
	}

	public static makeKey(pt1: Point, pt2: Point): string {
		return pt1.x + "-" + pt1.y + "-" + pt2.x + "-" + pt2.y;
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
		}
		else {
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
				linkType = "multi";
			}
		}

		switch (linkType) {
			case "manual":
				return DisplayEdgeType.Manual;
			case "lag":
				return DisplayEdgeType.Lag;
			case "associated":
				return DisplayEdgeType.Associated;
			case "multi":
				return DisplayEdgeType.Multi;
			default:
				return DisplayEdgeType.Standard;
		}
	}

	private get allLagLinks(): boolean {
		return this.deviceLinks.every(link => (link.linkType.toLowerCase() == "lag"));
	}

	public static toColorString(color: Color): string {
		return "#" +
			this.toHexString(color.red) +
			this.toHexString(color.green) +
			this.toHexString(color.blue);
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
				return "00";
			case 1:
				return "0" + result;
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

	private readonly map: Map<string,DisplayEdge>;

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

	public forEach(f: (arg0: DisplayEdge) => void): void {
		for (const key in this.map) {
            let value = this.map.get(key);
            if (value !== undefined) {
                f(value);
            }
		}
	}

	public some(f: (arg0: DisplayEdge) => boolean): boolean {
		for (const key in this.map) {
            let value = this.map.get(key);
            if (value !== undefined) {
                if (f(value)) {
                    return true;
                }
            }
		}
		return false;
	}
}
