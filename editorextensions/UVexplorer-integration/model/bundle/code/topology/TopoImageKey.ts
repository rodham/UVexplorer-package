export enum ImageType {
	DeviceCategory,
	Vendor,
	Status,
}

export interface TopoImageKey {
	type: ImageType;
	value: string;
}

export class TopoImageKeyUtil {
	public static areEqual(a: TopoImageKey, b: TopoImageKey) {
		return (a.type == b.type && a.value == b.value);
	}
}
