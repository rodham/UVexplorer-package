import { TopoImageEntry } from './TopoImageEntry';
import { ImageType, TopoImageKey, TopoImageKeyUtil } from './TopoImageKey';


export class TopoImageMap {
	private _topoImages: TopoImageEntry[];

	constructor() {
		this._topoImages = [];
	}

	public findEntry(key: TopoImageKey): TopoImageEntry | undefined {
        let result: TopoImageEntry | undefined = undefined;

        this._topoImages.some((entry) => {
			if (TopoImageKeyUtil.areEqual(entry.key, key)) {
				result = entry;
				return true;
			}
			return false;
		});

		return result;
	}

	public addEntries(entries: TopoImageEntry[]): void {
		entries.forEach((entry) => {
			this.addEntry(entry);
		});
	}

	public addEntry(entry: TopoImageEntry): void {
		if (entry) {
			if (!entry.key) {
				entry.key = {
					type: ImageType.DeviceCategory,
					value: "",
				};
			}
			this._topoImages.push(entry);
		}
	}
}
