import { TopoImageKey } from './TopoImageKey';


export interface TopoImageEntry {
	key : TopoImageKey;
	fileName: string;
	image?: HTMLImageElement;
}
