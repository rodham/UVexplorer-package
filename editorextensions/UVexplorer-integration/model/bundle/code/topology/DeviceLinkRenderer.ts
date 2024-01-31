import { TopoMap, DisplayEdge, DisplayEdgeSet } from '../dtos/topology/TopoMap';
import { LayoutType } from '../dtos/topology/LayoutSettings';
import { DeviceLink } from '../dtos/topology/DeviceLink';
import { DeviceLinkEdge } from '../dtos/topology/DeviceLinkEdge';
import { Point } from '../dtos/topology/Point';
import { IMapRenderer } from './IMapRenderer';
import { MouseOverLabel } from './MouseOverLabel';
import { CanvasExtensions } from './CanvasExtensions';
import { TopoMapComponentListener } from './TopoMapComponent';


export class DeviceLinkRenderer implements IMapRenderer {		
	private static hitMargin = 3;

	private map: TopoMap;

	constructor(private listener: TopoMapComponentListener) {
		return;
	}

	public setMap(map: TopoMap): void {
		this.map = map;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		if (!this.map) return;

		this.map.displayEdges.forEach((dispEdge: DisplayEdge) => {
			var remote = dispEdge.deviceLinkEdges[0].remoteConnection;
			var local = dispEdge.deviceLinkEdges[0].localConnection;

			let edgeColor: string = dispEdge.effectiveDrawSettings.color;
			let edgeDash: number[] = dispEdge.effectiveDrawSettings.lineDash;
			let edgeWidth: number = dispEdge.effectiveDrawSettings.width;

			ctx.beginPath();
			ctx.strokeStyle = edgeColor;
			ctx.lineWidth = edgeWidth;
			ctx.setLineDash(edgeDash);
			ctx.moveTo(remote.start.x, remote.start.y);
			ctx.lineTo(remote.mid.x, remote.mid.y);
			ctx.lineTo(remote.end.x, remote.end.y);
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle = edgeColor;
			ctx.lineWidth = edgeWidth;
			ctx.setLineDash(edgeDash);
			ctx.moveTo(local.start.x, local.start.y);
			ctx.lineTo(local.mid.x, local.mid.y);
			ctx.lineTo(local.end.x, local.end.y);
			ctx.stroke();
		});
	}

	getMouseOverLabels(point: Point, scale: number): MouseOverLabel[] {

        if (!this.map) {
            return;
        }

        var labels: MouseOverLabel[] = [];

		this.map.displayEdges.forEach((dispEdge: DisplayEdge) => {
			let firstLinkEdge: DeviceLinkEdge = dispEdge.deviceLinkEdges[0];
			let remote = firstLinkEdge.remoteConnection;
			let local = firstLinkEdge.localConnection;
			let scaledHitMargin = (DeviceLinkRenderer.hitMargin / scale);
			if (CanvasExtensions.isLineHit(remote.start, remote.mid, point, scaledHitMargin) ||
				CanvasExtensions.isLineHit(remote.mid, remote.end, point, scaledHitMargin) ||
				CanvasExtensions.isLineHit(local.start, local.mid, point, scaledHitMargin) ||
				CanvasExtensions.isLineHit(local.mid, local.end, point, scaledHitMargin)) {

				this.addLabels(dispEdge, labels);

				return true;
			}
			else {
				return false;
			}
		});

		return labels;
	}

	getAllLabels(): MouseOverLabel[] {
		var labels: MouseOverLabel[] = [];

		this.map.displayEdges.forEach((dispEdge: DisplayEdge) => {
			this.addLabels(dispEdge, labels);
		});

		return labels;
	}

	private addLabels(dispEdge: DisplayEdge, labels: MouseOverLabel[]): void {
		dispEdge.deviceLinkEdges.forEach((edge: DeviceLinkEdge) => {
			let remote = edge.remoteConnection;
			let local = edge.localConnection;

			let localPoint: Point = null;
			if (this.map.layoutSettings.layoutType == LayoutType.Hierarchical) {
				localPoint = CanvasExtensions.midPoint(local.start, local.mid);
			}
			else {
				localPoint = local.mid;
			}
			labels.push({
				location: localPoint,
				labels: local.interfaceLabels
			});

			let remotePoint: Point = null;
			if (this.map.layoutSettings.layoutType == LayoutType.Hierarchical) {
				remotePoint = CanvasExtensions.midPoint(remote.start, remote.mid);
			}
			else {
				remotePoint = remote.mid;
			}
			labels.push({
				location: remotePoint,
				labels: remote.interfaceLabels
			});
		}, this);
	}

	handleClick(point: Point, scale: number): boolean {
		return false;
	}

	handleMove(point: Point, scale: number): void {
	}

	handleUp(): void {
	}

	handleDoubleClick(point: Point, scale: number): boolean {
		let links: DeviceLink[] = this.hitTest(point, scale);

		if (links.length > 0 && links.some(link => link.linkMembers.length > 0)) {
			this.listener.onLinkDoubleClick(links);
			return true;
		}

		return false;
	}

	handleHover(point: Point, viewPoint: Point): boolean {
		return false;
	}

	handleContextMenu(point: Point, scale: number, ev: MouseEvent): boolean {
		let links: DeviceLink[] = this.hitTest(point, scale);

		if (links.length > 0 && links.some(link => link.linkMembers.length > 0)) {
			this.listener.onContextMenu("link", links, ev);
			return true;
		}

		return false;
	}

	hitTest(point: Point, scale: number): DeviceLink[] {
		let links: DeviceLink[] = [];

		this.map.displayEdges.forEach((dispEdge: DisplayEdge) => {
			let firstLinkEdge: DeviceLinkEdge = dispEdge.deviceLinkEdges[0];
			let remote = firstLinkEdge.remoteConnection;
			let local = firstLinkEdge.localConnection;
			let scaledHitMargin = (DeviceLinkRenderer.hitMargin / scale);
			if (CanvasExtensions.isLineHit(remote.start, remote.mid, point, scaledHitMargin) ||
				CanvasExtensions.isLineHit(remote.mid, remote.end, point, scaledHitMargin) ||
				CanvasExtensions.isLineHit(local.start, local.mid, point, scaledHitMargin) ||
				CanvasExtensions.isLineHit(local.mid, local.end, point, scaledHitMargin)) {

				links.push(...dispEdge.deviceLinks);
			}
		});

		return links;
	}

}
