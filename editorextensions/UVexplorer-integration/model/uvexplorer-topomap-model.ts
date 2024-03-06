import { DeviceFilter, DeviceLink, DeviceNode } from './uvexplorer-devices-model';

interface LayoutSettings {
    layoutType: 'Manual' | 'Radial' | 'Hierarchical' | 'Ring';
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
        layoutDirection: 'Left' | 'Right' | 'Up' | 'Down';
        rootAlignment: 'Left' | 'Center' | 'Right';
    };
    ringSettings?: {
        minRadius: number;
        maxRadius: number;
        maxAngle: number;
        maximizeRoot: boolean;
    };
}

interface DrawSettings {
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
    deviceDisplaySetting: 'Default' | 'Hostname' | 'IpAddress' | 'HostnameAndIpAddress';
    standardPen: PenPattern;
    lagPen: PenPattern;
    manualPen: PenPattern;
    associatedPen: PenPattern;
    multiPen: PenPattern;
    stpForwardingPen: PenPattern;
    stpBlockingPen: PenPattern;
}

interface PenPattern {
    color: {
        red: number;
        green: number;
        blue: number;
    };
    width: number;
    dashStyle: 'Solid' | 'Dash' | 'Dot' | 'DashDot' | 'DashDotDot';
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

export function createTopoMapRequest(deviceGuids: string[], layoutType: 'Hierarchical' | 'Manual' | 'Radial' | 'Ring'): TopoMapRequest {
    return new TopoMapRequest(
        {
            layoutType: layoutType,
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
                layoutDirection: 'Down',
                rootAlignment: 'Center'
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
            useStraightLinks: true
        },
        {
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
            deviceDisplaySetting: 'Default',
            standardPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            },
            lagPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            },
            manualPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            },
            associatedPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            },
            multiPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            },
            stpForwardingPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            },
            stpBlockingPen: {
                color: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                width: 1,
                dashStyle: 'Solid'
            }
        },
        deviceGuids
    );
}

export interface TopoMap {
    layoutSettings: LayoutSettings;
    drawSettings: DrawSettings;
    deviceNodes: DeviceNode[];
    deviceGroupNodes: DeviceNode[];
    hubNodes: DeviceNode[];
    imageNodes: unknown; //TODO: Find out this typing. The example request was [].
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
        Array.isArray(obj.imageNodes) && // Adjust the typing once known
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

export enum LayoutType {
    Manual,
    Radial,
    Hierarchical,
    Ring
}

export function isLayoutSettings(obj: unknown): obj is LayoutSettings {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'layoutType' in obj &&
        typeof obj.layoutType === 'number' &&
        Object.values(LayoutType).includes(obj.layoutType) &&
        'hierarchicalSettings' in obj &&
        (obj.hierarchicalSettings === null || isHierarchicalLayoutSettings(obj.hierarchicalSettings)) &&
        'radialSettings' in obj &&
        isRingRadialLayoutSettings(obj.radialSettings) &&
        'ringSettings' in obj &&
        isRingRadialLayoutSettings(obj.ringSettings) &&
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
        Array.isArray(obj.rootNodes)
    );
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

export enum DashStyle {
    Solid = 0,
    Dash = 1,
    Dot = 2,
    DashDot = 3,
    DashDotDot = 4,
    Custom = 5
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
