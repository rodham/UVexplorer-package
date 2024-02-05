

export enum LayoutType { Manual, Radial, Hierarchical, Ring }


export type DeviceGuid = string;


export interface LayoutSettings {
	layoutType: LayoutType;
	useStraightLinks: boolean;
	radialSettings: RadialLayoutSettings;
	hierarchicalSettings: HierarchicalLayoutSettings;
	ringSettings: RingLayoutSettings;
	showLayer2Links: boolean;
	showVirtualLinks: boolean;
	showWirelessLinks: boolean;
	showIpPhoneLinks: boolean;
	showLinkLabels: boolean;
	rootNodes: DeviceGuid[];
}


export enum LayoutDirection { Left, Right, Up, Down }


export enum RootAlignment { Left, Center, Right }


export interface RadialLayoutSettings {
	minRadius: number;
	maxRadius: number;
	maxAngle: number;
	maximizeRoot: boolean;
}


export interface HierarchicalLayoutSettings {
	levelSpacing: number;
	nodeSpacing: number;
	layoutDirection: LayoutDirection;
	rootAlignment: RootAlignment;
	useStraightLinks: boolean;
}


export interface RingLayoutSettings {
	minRadius: number;
	maxRadius: number;
	maxAngle: number;
	maximizeRoot: boolean;
}
