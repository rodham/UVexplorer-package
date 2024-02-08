export enum LayoutType {
    Manual,
    Radial,
    Hierarchical,
    Ring
}

export interface LayoutSettings {
    layoutType: LayoutType;
    hierarchicalSettings: HierarchicalLayoutSettings;
    showLinkLabels: boolean;
}

export function isLayoutSettings(obj: unknown): obj is LayoutSettings {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'layoutType' in obj &&
        typeof obj.layoutType === 'string' &&
        Object.values(LayoutType).includes(obj.layoutType) &&
        'hierarchicalSettings' in obj &&
        isHierarchicalLayoutSettings(obj.hierarchicalSettings) &&
        'showLinkLabels' in obj &&
        typeof obj.showLinkLabels === 'boolean'
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
        typeof obj.layoutDirection === 'string' &&
        Object.values(LayoutDirection).includes(obj.layoutDirection) &&
        'rootAlignment' in obj &&
        typeof obj.rootAlignment === 'string' &&
        Object.values(RootAlignment).includes(obj.rootAlignment) &&
        'useStraightLinks' in obj &&
        typeof obj.useStraightLinks === 'boolean'
    );
}
