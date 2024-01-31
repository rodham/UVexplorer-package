import { IRectangle } from './IRectangle';
import { TopoImageLibrary } from '../../topology/TopoImageLibrary';
import { ImageType, TopoImageKey } from '../../topology/TopoImageKey';

export interface DeviceGroupNode extends IRectangle {
    id: number;
    deviceGroupGuid: string;
    nodeId: number;
    displayName: string;
    deviceCount: number;
    x: number;
    y: number;
    centerX: number;
    centerY: number;
    bottom: number;
    width: number;
    height: number;
    selected: boolean;
}

export class DeviceGroupNodeUtil {
    public static getDeviceGroupImage(deviceGroupNode: DeviceGroupNode): HTMLImageElement {
        let result: HTMLImageElement = null;

        if (!!deviceGroupNode) {
            result = this.findUnkownImage('net-device');
        }

        return result;
    }

    private static findUnkownImage(category: string): HTMLImageElement {
        return TopoImageLibrary.findImage({
            type: ImageType.DeviceCategory,
            value: category
        });
    }

    //public static getVendorImage(deviceNode: DeviceNode): HTMLImageElement {

    //	let result: HTMLImageElement = null;

    //	result = TopoImageLibrary.findImage({
    //		type: ImageType.Vendor,
    //		value: deviceNode.vendor
    //	});

    //	if (!result) {
    //		let categories = deviceNode.categories;
    //		if (categories && categories.entries) {
    //			let vendor = "";

    //			if (DeviceNodeUtil.deviceCategoriesContain(categories, "windows"))
    //				vendor = "Microsoft";
    //			else if (DeviceNodeUtil.deviceCategoriesContain(categories, "windows-server"))
    //				vendor = "Microsoft";
    //			else if (DeviceNodeUtil.deviceCategoriesContain(categories, "apple"))
    //				vendor = "Apple";

    //			result = TopoImageLibrary.findImage({
    //				type: ImageType.Vendor,
    //				value: vendor
    //			});
    //		}
    //	}

    //	return result;
    //}

    private static getDeviceCount(): number {
        let result: number = 0;

        // logic here

        return result;
    }
}
