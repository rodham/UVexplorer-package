import { TopoMap } from '../dtos/topology/TopoMap';
import { Point } from '../dtos/topology/Point';
import { MouseOverLabel } from './MouseOverLabel';


export interface IMapRenderer {
	setMap(map: TopoMap) : void;
	render(ctx: CanvasRenderingContext2D): void;
	getMouseOverLabels(point: Point, scale: number): MouseOverLabel[];
	getAllLabels(): MouseOverLabel[];
	handleClick(point: Point, scale: number): boolean;
	handleMove(point: Point, scale: number): void;
	handleUp(): void;
	handleDoubleClick(point: Point, scale: number): boolean;
	handleHover(point: Point, viewPoint: Point): boolean;
	handleContextMenu(point: Point, scale: number, ev: MouseEvent): boolean;
}
