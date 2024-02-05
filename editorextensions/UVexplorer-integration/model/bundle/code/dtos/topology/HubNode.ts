import { TopoImageLibrary } from '../../topology/TopoImageLibrary';
import { ImageType } from '../../topology/TopoImageKey';


export interface HubNode {
	nodeId: number;
	label: string;
	x: number;
	y: number;
	centerX: number;
	bottom: number;
	width: number;
	height: number;
	type: MultiNodeType;
}

export enum MultiNodeType {
	Hub,
	WirelessClient,
	VirtualPortGroup
}

export class HubNodeUtil {
	public static getImage(node: HubNode): HTMLImageElement {
		var categoryKey = HubNodeUtil.getCategoryImageKey(node);
		var result = TopoImageLibrary.findImage({
			type: ImageType.DeviceCategory,
			value: categoryKey
		});
        if (result !== undefined) {
            return result;
        }
		return new HTMLImageElement(); //TODO ?? Added so TypeScript would compile
	}

	private static getCategoryImageKey(node: HubNode): string {
		switch(node.type) {
			case MultiNodeType.VirtualPortGroup:
				return "virtual-port-group";
			case MultiNodeType.WirelessClient:
				return "wireless-client";
			default:
				return "net-device";
		}
	}
}
