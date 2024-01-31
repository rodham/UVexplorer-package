

export enum LayoutType { Manual, Radial, Hierarchical, Ring }


export interface LayoutSettings {
	layoutType: LayoutType;
	hierarchicalSettings: HierarchicalLayoutSettings;
	showLinkLabels: boolean;
}


export enum LayoutDirection { Left, Right, Up, Down }


export enum RootAlignment { Left, Center, Right }


export interface HierarchicalLayoutSettings {
	levelSpacing: number;
	nodeSpacing: number;
	layoutDirection: LayoutDirection;
	rootAlignment: RootAlignment;
	useStraightLinks: boolean;
}
