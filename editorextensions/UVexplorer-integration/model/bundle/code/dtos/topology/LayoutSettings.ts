export enum LayoutType {
    Manual,
    Radial,
    Hierarchical,
    Ring
}

export interface LayoutSettings {
    layoutType: LayoutType;
    hierarchicalSettings: HierarchicalLayoutSettings | null;
    radialSettings: RingRadialLayoutSettings;
    ringSettings: RingRadialLayoutSettings;
    useStraightLinks: boolean;
    showLinkLabels: boolean;
    showLayer2Links: boolean;
    showVirtualLinks: boolean;
    showWirelessLinks: boolean;
    showIpPhoneLinks: boolean;
    rootNodes: unknown; // TODO: Find out this typing. The example response was [].
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
