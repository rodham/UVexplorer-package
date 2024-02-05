import { TopoMap, DisplayEdge } from '../dtos/topology/TopoMap';
import { HubNode } from '../dtos/topology/HubNode';
import { HubNodeUtil } from '../dtos/topology/HubNode';
import { Point } from '../dtos/topology/Point';
import { Rectangle } from '../dtos/topology/IRectangle';
import { IMapRenderer } from './IMapRenderer';
import { TopoImageLibrary } from './TopoImageLibrary';
import { MouseOverLabel } from './MouseOverLabel';
import { CanvasExtensions } from './CanvasExtensions';
import { TopoMapComponentListener } from './TopoMapComponent';
import { DeviceLinkEdge } from '../dtos/topology/DeviceLinkEdge';
import { LayoutSettings, LayoutType, LayoutDirection } from '../dtos/topology/LayoutSettings';


export class HubNodeRenderer implements IMapRenderer {
	private map : TopoMap;

	constructor(private listener: TopoMapComponentListener) {
		return;
	}

	public setMap(map: TopoMap): void {
		this.map = map;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		if (!this.map) return;
		if (!TopoImageLibrary.isLoaded) return;

		this.map.hubNodes.forEach((node: HubNode) => {
			var hubImage = HubNodeUtil.getImage(node);
			ctx.drawImage(hubImage, node.x, node.y);
			CanvasExtensions.drawLabel(ctx, node.centerX, node.bottom + 14, node.label);
		});
	}

	getMouseOverLabels(point: Point, scale:number): MouseOverLabel[] {
		return [];
	}

	getAllLabels(): MouseOverLabel[] {
		return [];
	}

	private dragNode: HubNode;
	private startPoint: Point;
	private startNodePosition: Point;

	handleClick(point: Point, scale: number): boolean {
		this.dragNode = null;
		return this.map.hubNodes.some((node: HubNode) => {
			if (Rectangle.contains(node, point)) {
				this.dragNode = node;
				this.startPoint = point;
				this.startNodePosition = { x: node.x, y: node.y };
				return true;
			}
			return false;
		});
	}

	handleMove(point: Point, scale: number): void {
		if (this.dragNode && this.startPoint && this.startNodePosition) {
			let deltaX = point.x - this.startPoint.x;
			let deltaY = point.y - this.startPoint.y;

			this.dragNode.x = this.startNodePosition.x + deltaX;
			this.dragNode.y = this.startNodePosition.y + deltaY;

			this.dragNode.centerX = this.dragNode.x + (this.dragNode.width / 2);

			this.dragNode.bottom = this.dragNode.y + this.dragNode.height;

			this.adjustDisplayEdges(this.dragNode);
		}
	}

	private adjustDisplayEdges(dragNode: HubNode): void {
		this.map.displayEdges.forEach((dispEdge: DisplayEdge) => {
			dispEdge.deviceLinkEdges.forEach((linkEdge: DeviceLinkEdge) => {
				let connStart: Point = {
					x: dragNode.x + dragNode.width / 2,
					y: dragNode.y + dragNode.height / 2
				};

				let localConn = linkEdge.localConnection;
				let remoteConn = linkEdge.remoteConnection;

				if (localConn.nodeId == dragNode.nodeId) {
					localConn.start = connStart;
				}
				if (remoteConn.nodeId == dragNode.nodeId) {
					remoteConn.start = connStart;
				}

				this.adjustDeviceConnections(linkEdge);
			});
		});
	}

	private adjustDeviceConnections(linkEdge: DeviceLinkEdge): void {
		let localConnStart = linkEdge.localConnection.start;
		let remoteConnStart = linkEdge.remoteConnection.start;

		let nodeMid = this.midPoint(localConnStart, remoteConnStart);

		let localConnMid = this.anglePoint(localConnStart, nodeMid, this.map.layoutSettings);
		let remoteConnMid = this.anglePoint(remoteConnStart, nodeMid, this.map.layoutSettings);

		let localConnEnd = {
			x: nodeMid.x,
			y: nodeMid.y
		};
		let remoteConnEnd = {
			x: nodeMid.x,
			y: nodeMid.y
		};

		linkEdge.localConnection.mid = localConnMid;
		linkEdge.remoteConnection.mid = remoteConnMid;

		linkEdge.localConnection.end = localConnEnd;
		linkEdge.remoteConnection.end = remoteConnEnd;
	}

	public midPoint(a: Point, b: Point): Point {
		return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
	}

	public anglePoint(nodePoint: Point, edgePoint: Point, layoutSettings: LayoutSettings): Point {
		if (layoutSettings.layoutType != LayoutType.Hierarchical ||
			layoutSettings.hierarchicalSettings.useStraightLinks) {
			return this.midPoint(nodePoint, edgePoint);
		}
		else {
			switch (layoutSettings.hierarchicalSettings.layoutDirection) {
				case LayoutDirection.Right:
				case LayoutDirection.Left:
					return { x: edgePoint.x, y: nodePoint.y };
				case LayoutDirection.Up:
				case LayoutDirection.Down:
					return { x: nodePoint.x, y: edgePoint.y };
				default:
					return { x: 0, y: 0 };
			}
		}
	}

	handleUp(): void {

		this.listener.onMoveNode(this.dragNode.nodeId, this.dragNode.x, this.dragNode.y);

		this.dragNode = null;
		this.startPoint = null;
		this.startNodePosition = null;
	}

	handleDoubleClick(point: Point, scale: number): boolean {
		return false;
	}

	handleHover(point: Point, viewPoint: Point): boolean {
		return false;
	}

	handleContextMenu(point: Point, scale: number, ev: MouseEvent): boolean {
		let hubs: HubNode[] = this.hitTest(point, scale);

		if (hubs.length > 0) {
			this.listener.onContextMenu("hub", hubs, ev);
			return true;
		}

		return false;
	}

	hitTest(point: Point, scale: number): HubNode[] {
		let hubs: HubNode[] = [];

		this.map.hubNodes.forEach((node: HubNode) => {
			if (Rectangle.contains(node, point)) {
				hubs.push(node);
			}
		});

		return hubs;
	}

}
