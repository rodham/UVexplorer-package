﻿import { TopoMap, DisplayEdge } from '../dtos/topology/TopoMap';
import { DeviceNode } from '../dtos/topology/DeviceNode';
import { DeviceNodeUtil } from '../dtos/topology/DeviceNode';
import { Point } from '../dtos/topology/Point';
import { Rectangle } from '../dtos/topology/IRectangle';
import { IMapRenderer } from './IMapRenderer';
import { TopoImageLibrary } from './TopoImageLibrary';
import { MouseOverLabel } from './MouseOverLabel';
import { CanvasExtensions } from './CanvasExtensions';
import { TopoMapComponentListener } from './TopoMapComponent';
import { DeviceLinkEdge } from '../dtos/topology/DeviceLinkEdge';
import { LayoutSettings, LayoutType, LayoutDirection } from '../dtos/topology/LayoutSettings';


export class DeviceNodeRenderer implements IMapRenderer {
	private static iconOffset = 3;
	private map: TopoMap;

	constructor(private listener: TopoMapComponentListener) {
		return;
	}

	public setMap(map: TopoMap) {
		this.map = map;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		if (!this.map) return;
		if (!TopoImageLibrary.isLoaded) return;

		this.map.deviceNodes.forEach((node: DeviceNode) => {
			var x = node.x;
			var y = node.y;

			var nodeImage = DeviceNodeUtil.getCategoryImage(node);

			var statusBackground = DeviceNodeUtil.getStatusBackgroundImage(node);
			if (statusBackground != null) {
				var imageWidth = nodeImage.width;
				var offset = (statusBackground.width - imageWidth) / 2;
				ctx.drawImage(statusBackground, x - offset, y - offset, statusBackground.width, statusBackground.height);
			}

			ctx.drawImage(nodeImage, node.x, node.y);

			var vendorImage = DeviceNodeUtil.getVendorImage(node);
			if (vendorImage != null) {
				var vX = x + nodeImage.width + DeviceNodeRenderer.iconOffset - vendorImage.width;
				var vY = y + nodeImage.height + DeviceNodeRenderer.iconOffset - vendorImage.height;
				ctx.drawImage(vendorImage, vX, vY, vendorImage.width, vendorImage.height);
			}

			var statusImage = DeviceNodeUtil.getStatusIconImage(node);
			if (statusImage != null) {
				var vX = x - statusImage.width / 2;
				var vY = y + nodeImage.height + DeviceNodeRenderer.iconOffset - statusImage.height;
				ctx.drawImage(statusImage, vX, vY, statusImage.width, statusImage.height);
			}

			CanvasExtensions.drawLabel(ctx, node.centerX, node.bottom + 18, node.displayName);

			if (node.selected) {
				node.selected = false;

				ctx.strokeStyle = "lime";
				ctx.lineWidth = 3;
				ctx.strokeRect(node.x, node.y, node.width, node.height);
			}

		}, this);
	}

	getMouseOverLabels(point: Point, scale: number): MouseOverLabel[] {
		return [];
	}

	getAllLabels(): MouseOverLabel[] {
		return [];
	}

	private dragNode: DeviceNode;
	private startPoint: Point;
	private startNodePosition: Point;

	handleClick(point: Point, scale: number): boolean {
		this.dragNode = null;
		return this.map.deviceNodes.some((node: DeviceNode) => {
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

	private adjustDisplayEdges(dragNode: DeviceNode): void {
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
		//return this.map.deviceNodes.some((node: DeviceNode) => {
		//	if (node.id > 0 && Rectangle.contains(node, point)) {
		//		DetailsDialog.open(`/controls/layer2device.htm?id=${node.id}`, "Device Details");
		//		return true;
		//	}
		//	return false;
		//});

		return this.map.deviceNodes.some((node: DeviceNode) => {
			if (Rectangle.contains(node, point)) {
				if (node.deviceGuid && this.listener) {
					this.listener.onDeviceDoubleClick(node.deviceGuid);
				}
				return true;
			}
			return false;
		});
	}

	handleHover(point: Point, viewPoint:Point): boolean {
		//return this.map.deviceNodes.some((node: DeviceNode) => {
		//	if (node.id > 0 && Rectangle.contains(node, point)) {
		//		var mouse = { left: viewPoint.x - 5, top: viewPoint.y - 5, width: 0, height: 0};
		//		var $obj = $('<obj/>',
		//			{
		//				id: node.id,
		//				'class': 'devicemenu device',
		//				href: 'device.htm?id=' + node.id,
		//				css: {
		//					'background-image': 'background-image:url(/icons/devices/switch_1.png)'
		//				},
		//				text: node.displayName
		//			});
		//		$.fn.ptip.show.apply($obj[0], [mouse]);
		//		return true;
		//	}
		//	return false;
		//});

		return true;
	}

	handleContextMenu(point: Point, scale: number, ev: MouseEvent): boolean {
		let devices: DeviceNode[] = this.hitTest(point, scale);

		if (devices.length > 0) {
			this.listener.onContextMenu("device", devices, ev);
			return true;
		}

		return false;
	}

	hitTest(point: Point, scale: number): DeviceNode[] {
		let devices: DeviceNode[] = [];

		this.map.deviceNodes.forEach((node: DeviceNode) => {
			if (Rectangle.contains(node, point)) {
				devices.push(node);
			}
		});

		return devices;
	}

}
