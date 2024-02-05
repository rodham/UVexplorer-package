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
	public static getDeviceGroupImage(deviceGroupNode: DeviceGroupNode): HTMLImageElement | undefined {
		if (!!deviceGroupNode) {
			return this.findUnkownImage("net-device");
		}
		return undefined;
	}

	private static findUnkownImage(category: string): HTMLImageElement | undefined {
		return TopoImageLibrary.findImage({
			type: ImageType.DeviceCategory,
			value: category
		});
	}

	private static getDeviceCount(): number {
		let result: number = 0;

		// logic here

		return result;
	}
}
