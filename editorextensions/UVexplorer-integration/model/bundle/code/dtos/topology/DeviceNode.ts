import { IRectangle } from './IRectangle';
import { TopoImageLibrary } from '../../topology/TopoImageLibrary';
import { ImageType, TopoImageKey } from '../../topology/TopoImageKey';

export enum DeviceCategoryType {
    System = 0,
    User = 1
}

export interface DeviceCategoriesEntry {
    categoryName: string;
    categoryType: DeviceCategoryType;
}

export interface DeviceCategories {
    entries: DeviceCategoriesEntry[];
}

export interface DeviceNode extends IRectangle {
    id: number;
    deviceGuid: string;
    nodeId: number;
    displayName: string;
    ipAddress: string;
    macAddress: string;
    hostname: string;
    systemName: string;
    netBiosName: string;
    categories: DeviceCategories;
    vendor: string;
    status: DeviceState;
    x: number;
    y: number;
    centerX: number;
    centerY: number;
    bottom: number;
    width: number;
    height: number;
    selected: boolean;
}

export enum DeviceState {
    Unknown = 0,
    Down,
    Warning,
    Information,
    Up,
    Paused,
    NoData
}

export class DeviceNodeUtil {
    public static getCategoryImage(deviceNode: DeviceNode): HTMLImageElement {
        let result: HTMLImageElement | null = null;

        if (!!deviceNode.categories && !!deviceNode.categories.entries) {
            deviceNode.categories.entries.some((entry: DeviceCategoriesEntry) => {
                if (entry.categoryType === DeviceCategoryType.User) {
                    result = DeviceNodeUtil.findCategoryImage(entry.categoryName);
                    return !!result;
                }
                return false;
            });

            if (!result) {
                let primaryCategory = DeviceNodeUtil.getPrimaryDeviceCategory(deviceNode.categories);
                if (!!primaryCategory) {
                    result = DeviceNodeUtil.findCategoryImage(primaryCategory);
                }
            }
        }

        if (!result) {
            // Look for default category image
            result = DeviceNodeUtil.findCategoryImage('');
        }

        return result;
    }

    private static findCategoryImage(category: string): HTMLImageElement {
        return TopoImageLibrary.findImage({
            type: ImageType.DeviceCategory,
            value: category
        });
    }

    public static getVendorImage(deviceNode: DeviceNode): HTMLImageElement {
        let result: HTMLImageElement | null = null;

        result = TopoImageLibrary.findImage({
            type: ImageType.Vendor,
            value: deviceNode.vendor
        });

        if (!result) {
            let categories = deviceNode.categories;
            if (categories && categories.entries) {
                let vendor = '';

                if (DeviceNodeUtil.deviceCategoriesContain(categories, 'windows')) vendor = 'Microsoft';
                else if (DeviceNodeUtil.deviceCategoriesContain(categories, 'windows-server')) vendor = 'Microsoft';
                else if (DeviceNodeUtil.deviceCategoriesContain(categories, 'apple')) vendor = 'Apple';

                result = TopoImageLibrary.findImage({
                    type: ImageType.Vendor,
                    value: vendor
                });
            }
        }

        return result;
    }

    private static getPrimaryDeviceCategory(categories: DeviceCategories): string {
        let OrderedPrimaryCategories = [
            'firewall',
            'router',
            'switch',
            'printer',
            'wireless-controller',
            'wireless-ap',
            'virtual-server',
            'virtual-switch',
            'virtual-port-group',
            'ip-phone',
            'ip-phone-manager',
            'server',
            'workstation',
            'windows',
            'windows-server',
            'ip_camera_cctv'
        ];

        let result: string = '';

        if (categories && categories.entries) {
            OrderedPrimaryCategories.some((catName: string) => {
                if (DeviceNodeUtil.deviceCategoriesContain(categories, catName)) {
                    result = catName;
                    return true;
                } else {
                    return false;
                }
            }, this);
        }

        return result;
    }

    private static deviceCategoriesContain(categories: DeviceCategories, catName: string): boolean {
        if (categories && categories.entries) {
            return categories.entries.some((entry: DeviceCategoriesEntry) => {
                return entry.categoryName === catName;
            }, this);
        } else {
            return false;
        }
    }

    public static getStatusIconImage(deviceNode: DeviceNode): HTMLImageElement {
        var iconKey = DeviceNodeUtil.stateIconKey(deviceNode.status);

        return TopoImageLibrary.findImage({
            type: ImageType.Status,
            value: iconKey
        });
    }

    public static getStatusBackgroundImage(deviceNode: DeviceNode): HTMLImageElement {
        var iconKey = DeviceNodeUtil.stateBackgroundKey(deviceNode.status);

        return TopoImageLibrary.findImage({
            type: ImageType.Status,
            value: iconKey
        });
    }

    private static stateIconKey(status: DeviceState): string {
        switch (status) {
            case DeviceState.Down:
                return 'DownIcon';
            case DeviceState.Up:
                return 'UpIcon';
            case DeviceState.Warning:
                return 'WarnIcon';
            case DeviceState.Unknown:
                return 'UnknownIcon';
            case DeviceState.Paused:
                return 'PausedIcon';
            default:
                return '';
        }
    }

    private static stateBackgroundKey(status: DeviceState): string {
        switch (status) {
            case DeviceState.Down:
                return 'DownBackground';
            case DeviceState.Warning:
                return 'WarnBackground';
            case DeviceState.Unknown:
                return 'UnknownBackground';
            case DeviceState.Paused:
                return 'PausedBackground';
            default:
                return '';
        }
    }
}
