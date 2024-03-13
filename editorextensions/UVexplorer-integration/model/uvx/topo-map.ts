import { DeviceFilter, DeviceLink, DeviceNode } from './device';
import { HubNode } from 'model/uvx/hub-node';

export enum LayoutType {
    Manual,
    Radial,
    Hierarchical,
    Ring
}

export enum LayoutDirection {
    Left,
    Right,
    Up,
    Down
}

export enum RootAlignment {
    Left,
    Center,
    Right
}

export enum DeviceDisplaySetting {
    Default,
    Hostname,
    IpAddress,
    HostnameAndIpAddress
}

export enum DashStyle {
    Solid = 0,
    Dash = 1,
    Dot = 2,
    DashDot = 3,
    DashDotDot = 4,
    Custom = 5
}

export interface LayoutSettings {
    layoutType: LayoutType;
    useStraightLinks: boolean;
    showLayer2Links: boolean;
    showVirtualLinks: boolean;
    showWirelessLinks: boolean;
    showIpPhoneLinks: boolean;
    showLinkLabels: boolean;
    radialSettings?: {
        minRadius: number;
        maxRadius: number;
        maxAngle: number;
        maximizeRoot: boolean;
    };
    hierarchicalSettings?: {
        levelSpacing: number;
        useStraightLinks: boolean;
        nodeSpacing: number;
        layoutDirection: LayoutDirection;
        rootAlignment: RootAlignment;
    };
    ringSettings?: {
        minRadius: number;
        maxRadius: number;
        maxAngle: number;
        maximizeRoot: boolean;
    };
    rootNodes?: unknown;
}

export interface DrawSettings {
    shortDeviceNames: boolean;
    deviceTrimLeft: boolean;
    deviceTrimRight: boolean;
    deviceTrimLeftChar: string;
    deviceTrimRightChar: string;
    deviceTrimRightCount: number;
    deviceTrimLeftCount: number;
    shortIfNames: boolean;
    hideVendorImage: boolean;
    hidePlatformImage: boolean;
    deviceDisplaySetting: DeviceDisplaySetting;
    standardPen: PenPattern;
    lagPen: PenPattern;
    manualPen: PenPattern;
    associatedPen: PenPattern;
    multiPen: PenPattern;
    stpForwardingPen: PenPattern;
    stpBlockingPen: PenPattern;
}

export interface PenPattern {
    color: {
        red: number;
        green: number;
        blue: number;
    };
    width: number;
    dashStyle: DashStyle;
}

export class TopoMapRequest {
    deviceGuids?: string[];
    primaryDeviceFilter?: DeviceFilter;
    connectedDeviceFilter?: DeviceFilter;
    layoutSettings: LayoutSettings;
    drawSettings: DrawSettings;

    constructor(
        layoutSettings: LayoutSettings,
        drawSettings: DrawSettings,
        deviceGuids?: string[],
        primaryDeviceFilter?: DeviceFilter,
        connectedDeviceFilter?: DeviceFilter
    ) {
        this.deviceGuids = deviceGuids;
        this.primaryDeviceFilter = primaryDeviceFilter;
        this.connectedDeviceFilter = connectedDeviceFilter;
        this.layoutSettings = layoutSettings;
        this.drawSettings = drawSettings;
    }
}

export function createTopoMapRequest(
    deviceGuids: string[],
    layoutSettings: LayoutSettings,
    drawSettings: DrawSettings
): TopoMapRequest {
    return new TopoMapRequest(layoutSettings, drawSettings, deviceGuids);
}

export const manualLayoutSettings: LayoutSettings = {
    layoutType: LayoutType.Manual,
    showIpPhoneLinks: true,
    showLayer2Links: true,
    showLinkLabels: true,
    showVirtualLinks: true,
    showWirelessLinks: true,
    useStraightLinks: true,
    rootNodes: []
};

export const defaultLayoutSettings: LayoutSettings = {
    layoutType: LayoutType.Hierarchical,
    radialSettings: {
        minRadius: 0,
        maxRadius: 0,
        maxAngle: 0,
        maximizeRoot: true
    },
    hierarchicalSettings: {
        levelSpacing: 100,
        useStraightLinks: true,
        nodeSpacing: 100,
        layoutDirection: LayoutDirection.Down,
        rootAlignment: RootAlignment.Center
    },
    ringSettings: {
        minRadius: 0,
        maxRadius: 0,
        maxAngle: 0,
        maximizeRoot: true
    },
    showIpPhoneLinks: true,
    showLayer2Links: true,
    showLinkLabels: true,
    showVirtualLinks: true,
    showWirelessLinks: true,
    useStraightLinks: true,
    rootNodes: []
};

export const defaultDrawSettings: DrawSettings = {
    shortDeviceNames: false,
    deviceTrimLeft: false,
    deviceTrimRight: false,
    deviceTrimLeftChar: '.',
    deviceTrimRightChar: '.',
    deviceTrimRightCount: 1,
    deviceTrimLeftCount: 1,
    shortIfNames: false,
    hideVendorImage: false,
    hidePlatformImage: false,
    deviceDisplaySetting: DeviceDisplaySetting.Default,
    standardPen: {
        color: {
            red: 0,
            green: 0,
            blue: 0
        },
        width: 1,
        dashStyle: DashStyle.Solid
    },
    lagPen: {
        color: {
            red: 0,
            green: 0,
            blue: 0
        },
        width: 1,
        dashStyle: DashStyle.Solid
    },
    manualPen: {
        color: {
            red: 0,
            green: 0,
            blue: 0
        },
        width: 1,
        dashStyle: DashStyle.Solid
    },
    associatedPen: {
        color: {
            red: 0,
            green: 0,
            blue: 0
        },
        width: 1,
        dashStyle: DashStyle.Solid
    },
    multiPen: {
        color: {
            red: 0,
            green: 0,
            blue: 0
        },
        width: 1,
        dashStyle: DashStyle.Solid
    },
    stpForwardingPen: {
        color: {
            red: 0,
            green: 0,
            blue: 0
        },
        width: 1,
        dashStyle: DashStyle.Solid
    },
    stpBlockingPen: {
        color: {
            red: 0,
            green: 0,
            blue: 0
        },
        width: 1,
        dashStyle: DashStyle.Solid
    }
};

export interface TopoMap {
    layoutSettings: LayoutSettings;
    drawSettings: DrawSettings;
    deviceNodes: DeviceNode[];
    deviceGroupNodes: unknown;
    hubNodes: HubNode[];
    imageNodes: unknown;
    deviceLinks: DeviceLink[];
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    centerX: number;
    centerY: number;

    displayEdges?: unknown;
}

//TODO this type guard can be stricter once we are in a more final state
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
        'imageNodes' in obj &&
        Array.isArray(obj.imageNodes) &&
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
        typeof obj.centerY === 'number' // &&
        // ('displayEdges' in obj ? isDisplayEdgeSet(obj.displayEdges) : true)
    );
}

export function isLayoutSettings(obj: unknown): obj is LayoutSettings {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'layoutType' in obj &&
        typeof obj.layoutType === 'number' &&
        Object.values(LayoutType).includes(obj.layoutType) &&
        'useStraightLinks' in obj &&
        typeof obj.useStraightLinks === 'boolean' &&
        'showLinkLabels' in obj &&
        typeof obj.showLinkLabels === 'boolean' &&
        'showLayer2Links' in obj &&
        typeof obj.showLayer2Links === 'boolean' &&
        'showVirtualLinks' in obj &&
        typeof obj.showVirtualLinks === 'boolean' &&
        'showWirelessLinks' in obj &&
        typeof obj.showWirelessLinks === 'boolean' &&
        'showIpPhoneLinks' in obj &&
        typeof obj.showIpPhoneLinks === 'boolean' &&
        'rootNodes' in obj &&
        Array.isArray(obj.rootNodes) &&
        (!('hierarchicalSettings' in obj) ||
            obj.hierarchicalSettings === null ||
            isHierarchicalLayoutSettings(obj.hierarchicalSettings)) &&
        (!('radialSettings' in obj) || obj.radialSettings === null || isRingRadialLayoutSettings(obj.radialSettings)) &&
        (!('ringSettings' in obj) || obj.ringSettings === null || isRingRadialLayoutSettings(obj.ringSettings))
    );
}

export interface HierarchicalLayoutSettings {
    levelSpacing: number;
    nodeSpacing: number;
    layoutDirection: LayoutDirection;
    rootAlignment: RootAlignment;
    useStraightLinks: boolean;
}

export function isHierarchicalLayoutSettings(obj: unknown): obj is HierarchicalLayoutSettings {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'levelSpacing' in obj &&
        typeof obj.levelSpacing === 'number' &&
        'nodeSpacing' in obj &&
        typeof obj.nodeSpacing === 'number' &&
        'layoutDirection' in obj &&
        typeof obj.layoutDirection === 'number' &&
        Object.values(LayoutDirection).includes(obj.layoutDirection) &&
        'rootAlignment' in obj &&
        typeof obj.rootAlignment === 'number' &&
        Object.values(RootAlignment).includes(obj.rootAlignment) &&
        'useStraightLinks' in obj &&
        typeof obj.useStraightLinks === 'boolean'
    );
}

export interface RingRadialLayoutSettings {
    minRadius: number;
    maxRadius: number;
    maxAngle: number;
    maximizeRoot: boolean;
}

export function isRingRadialLayoutSettings(obj: unknown): obj is RingRadialLayoutSettings {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'minRadius' in obj &&
        typeof obj.minRadius === 'number' &&
        'maxRadius' in obj &&
        typeof obj.maxRadius === 'number' &&
        'maxAngle' in obj &&
        typeof obj.maxAngle === 'number' &&
        'maximizeRoot' in obj &&
        typeof obj.maximizeRoot === 'boolean'
    );
}

export function isDrawSettings(obj: unknown): obj is DrawSettings {
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
        'hideVendorImage' in obj &&
        typeof obj.hideVendorImage === 'boolean' &&
        'hidePlatformImage' in obj &&
        typeof obj.hidePlatformImage === 'boolean' &&
        'deviceDisplaySetting' in obj &&
        typeof obj.deviceDisplaySetting === 'number' &&
        Object.values(DeviceDisplaySetting).includes(obj.deviceDisplaySetting) &&
        'standardPen' in obj &&
        isPenPattern(obj.standardPen) &&
        'lagPen' in obj &&
        isPenPattern(obj.lagPen) &&
        'manualPen' in obj &&
        isPenPattern(obj.manualPen) &&
        'associatedPen' in obj &&
        isPenPattern(obj.associatedPen) &&
        'multiPen' in obj &&
        isPenPattern(obj.multiPen) &&
        'stpForwardingPen' in obj &&
        isPenPattern(obj.stpForwardingPen) &&
        'stpBlockingPen' in obj &&
        isPenPattern(obj.stpBlockingPen)
    );
}

export interface Color {
    red: number;
    green: number;
    blue: number;
}

export function isColor(obj: unknown): obj is Color {
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

export function isPenPattern(obj: unknown): obj is PenPattern {
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
