import { TopoMap, DisplayEdgeSet } from '../dtos/topology/TopoMap';
import { Point } from '../dtos/topology/Point';
import { IMapRenderer } from './IMapRenderer';
import { MouseOverLabel } from './MouseOverLabel';
import { DeviceNodeRenderer } from './DeviceNodeRenderer';
import { DeviceGroupNodeRenderer } from './DeviceGroupNodeRenderer';
import { HubNodeRenderer } from './HubNodeRenderer';
import { DeviceLinkRenderer } from './DeviceLinkRenderer';
import { CanvasExtensions } from './CanvasExtensions';
import { TopoImageLibrary } from './TopoImageLibrary';
import { Matrix } from './Matrix';
import { DeviceLink } from '../dtos/topology/DeviceLink';
import { DeviceNode } from '../dtos/topology/DeviceNode';
import { DeviceGroupNode } from '../dtos/topology/DeviceGroupNode';


export interface TopoMapComponentListener {
	onDeviceDoubleClick(deviceGuid: string): void;
	onDeviceGroupDoubleClick(deviceGroupGuid: string): void;
	onLinkDoubleClick(links: DeviceLink[]): void;
	onMapDoubleClick(): void;
	onMoveNode(nodeId: number, newX: number, newY: number): void;
	onContextMenu(targetType: string, targets: any[], ev: MouseEvent): void;
}


export class TopoMapComponent {
	private map: TopoMap;
	private isEditable: boolean;
	private orderedRenderers: IMapRenderer[];
	private mouseOverLabels: MouseOverLabel[];
	private allLabels: MouseOverLabel[];
	private visible = false;
	private w_centerPt: Point;

	constructor(
		private canvas: HTMLCanvasElement,
		private overLay: HTMLCanvasElement,
		private container: HTMLDivElement,
		private listener: TopoMapComponentListener
	) {
		this._scale = 1;
		this.w_centerPt = { x: 0, y: 0 };

		window.addEventListener("resize", () => this.onResize(), false);

		this.orderedRenderers =
			[
				new DeviceGroupNodeRenderer(listener),
				new DeviceNodeRenderer(listener),
				new HubNodeRenderer(listener),
				new DeviceLinkRenderer(listener)
			];

		this.initMouseListeners();
	}

	public hasMap(): boolean {
		return !!this.map;
	}

	public getMap(): TopoMap {
		return this.map;
	}

	private get worldMidPoint(): Point {
		if (this.map) {
			return <Point>{
				x: (this.map.left + this.map.width / 2),
				y: (this.map.top + this.map.height / 2),
			};
		}
		else {
			return <Point>{ x: 0, y: 0 };
		}
	}

	public setMap(map: TopoMap, isEditable: boolean): void {
		this.map = map;
		this.w_centerPt = this.worldMidPoint;
		this.populateMapDisplayEdges(map);
		this.orderedRenderers.forEach(r => r.setMap(map));
		this.isEditable = isEditable;
		this.initAllLabels();
		this.drawMap();
		this.fitAndCenterWhenContainerReady();
	}

	public setVisible(value: boolean): void {
		this.visible = value;
		this.fitAndCenterWhenContainerReady();
	}

	private doOpWhenContainerReady(opName: string, op: () => void): void {
		let opFieldName = this.makeOpFieldName(opName);
		if (this.visible && !this[opFieldName]) {
			this[opFieldName] = true;
			this.doOpWhenContainerReady_Helper(opFieldName, op);
		}
	}

	private doOpWhenContainerReady_Helper(opFieldName: string, op: () => void): void {
		if (this.containerWidth > 0 && this.containerHeight > 0) {
			this[opFieldName] = false;
			if (this.map) {
				op();
			}
		}
		else {
			setTimeout(() => {
				this.doOpWhenContainerReady_Helper(opFieldName, op);
			}, 100);
		}
	}

	private makeOpFieldName(opName: string): string {
		return ("doing_" + opName);
	}

	private initMouseListeners(): void {
		this.canvas.onmousemove = this.onMouseMove;
		this.canvas.ondblclick = this.onDoubleClick;
		this.canvas.onmousedown = this.onMouseDown;
		this.canvas.onmouseup = this.onMouseUp;
        this.canvas.onmouseenter = this.onMouseEnter;
		this.canvas.onwheel = this.onMouseWheel;
		this.canvas.oncontextmenu = this.onContextMenu;
	}

	private populateMapDisplayEdges(map: TopoMap): void {

		let dispEdges = new DisplayEdgeSet(map.drawSettings);

		map.deviceLinks.forEach((link: DeviceLink) => {
			link.linkEdges.forEach(edge => {
				let local = edge.localConnection;
				let remote = edge.remoteConnection;

				let pt1 = local.start;
				let pt2 = remote.start;

				let dispEdge = dispEdges.get(pt1, pt2);
				dispEdge.deviceLinkEdges.push(edge);
				dispEdge.deviceLinks.push(link);
			});
		});

		map.displayEdges = dispEdges;
	}

	private initAllLabels(): void {
		this.allLabels = [];
		if (this.map.layoutSettings.showLinkLabels) {
			this.orderedRenderers.forEach(r => this.allLabels.push(...r.getAllLabels()));
		}
	}

	public zoomChange = .05;
	public zoomMax = 2;
	public zoomMin = .1;
	public zoomMiddle = 1;
	private _scale: number;
	public get scale(): number {
		return this._scale;
	}

	public zoomValueChanged: (value: number) => void;

	private zoom(newZoom: number, location: Point) {
		if (newZoom > this.zoomMax)
			newZoom = this.zoomMax;

		if (newZoom < this.zoomMin)
			newZoom = this.zoomMin;

		var worldPoint = this.viewToWorld(location);

		this._scale = newZoom;
		this.scrollWorldPointToViewPoint(worldPoint, location);
		this.drawMap();

		if (this.zoomValueChanged) {
			this.zoomValueChanged(newZoom);
		}
	}

	private onMouseWheel = (ev: WheelEvent) => {
        this.clearPopupTimer();
		if (ev.ctrlKey) {
			var location = this.adjustDevicePoint({ x: ev.clientX, y: ev.clientY });
			if (ev.deltaY < 0) {
				this.zoomIn(location);
			} else {
				this.zoomOut(location);
			}
			ev.preventDefault();
		}
	}

	public zoomAtCenter(zoomValue: number) {
		let viewCenter = { x: this.containerWidth / 2, y: this.containerHeight / 2 };
		this.zoom(zoomValue, viewCenter);
	}

	public zoomFullSizeAtCenter() {
		this.zoomAtCenter(1);
	}

	private zoomFullSizeAtCenterWhenContainerReady(): void {
		this.doOpWhenContainerReady("zoomFullSizeAtCenter", () => this.zoomFullSizeAtCenter());
	}

	private zoomIn(location: Point): void {
		var newZoom = this._scale + this.zoomChange;
		this.zoom(newZoom, location);
	}

	private zoomOut(location: Point) : void {
		var newZoom = this._scale - this.zoomChange;
		this.zoom(newZoom, location);
	}

	private zoomToFit(): void {
		var viewWidth = this.containerWidth;
		var viewHeight = this.containerHeight;

		var mapWidth = this.map.width;
		var mapHeight = this.map.height;

		if (mapWidth > 0 && mapHeight > 0) {
			var widthRatio = (viewWidth / mapWidth);
			var heightRatio = (viewHeight / mapHeight);

			var ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

			var zoomValue = (this.zoomMiddle * ratio);
			if (zoomValue > this.zoomMiddle)
				zoomValue = this.zoomMiddle;
			this.zoomAtCenter(zoomValue);
		}
	}

	public showDeviceOnMap(deviceGuid: string): void {
		this.visible = true;

		let deviceNode: DeviceNode;
		deviceNode = this.map.deviceNodes.find((devNode) => devNode.deviceGuid === deviceGuid);
		if (deviceNode) {
			deviceNode.selected = true;
			this.w_centerPt = { x: deviceNode.centerX, y: deviceNode.centerY };
			this.zoomFullSizeAtCenterWhenContainerReady();
		}
	}

	public showDeviceGroupOnMap(deviceGroupGuid: string): void {
		this.visible = true;

		let deviceGroupNode: DeviceGroupNode;
		deviceGroupNode = this.map.deviceGroupNodes.find((devGroupNode) => devGroupNode.deviceGroupGuid === deviceGroupGuid);
		if (deviceGroupNode) {
			deviceGroupNode.selected = true;
			this.w_centerPt = { x: deviceGroupNode.centerX, y: deviceGroupNode.centerY };
			this.zoomFullSizeAtCenterWhenContainerReady();
		}
	}

	public fitAndCenter(): void {
		this.zoomToFit();
		this.scrollToCenter();
	}

	private fitAndCenterWhenContainerReady(): void {
		this.doOpWhenContainerReady("fitAndCenter", () => this.fitAndCenter());
	}

	private onDoubleClick = (ev: MouseEvent) => {
		this.clearPopupTimer();
		var worldPoint = this.viewToWorld(this.adjustDevicePoint({ x: ev.clientX, y: ev.clientY }));
		if (!this.orderedRenderers.some(r => r.handleDoubleClick(worldPoint, this.scale))) {
			this.listener.onMapDoubleClick();
		}
	}

	private mouseDown:Point = null;
	private dragging: boolean = false;
	private dragRenderer: IMapRenderer;
	private static readonly DragBuffer = 5;
	private w_dragStartPt: Point;
	private w_dragStartCenterPt: Point;
	private dragTransform: Matrix;
	private dragTimer: any;
	private static readonly DragTimerThreshold = 0;	// maps that take longer than this to draw will be redrawn using the drag timer
	private static readonly DragTimerTimeout = 200;	// milliseconds between map redraws when drag timer is being used

	private clearDragTimer() {
		if (!!this.dragTimer) {
			clearTimeout(this.dragTimer);
			this.dragTimer = null;
		}
	}

	private adjustDevicePoint(d_Pt: Point): Point {
		let rect = this.canvas.getBoundingClientRect();
		return {
			x: (d_Pt.x - rect.left),
			y: (d_Pt.y - rect.top)
		};
	}

	private onMouseEnter = (ev: MouseEvent) => {
		if (this.mouseDown !== null && ev.buttons === 0) {
			this.endDrag();
		}
	}

	private onMouseDown = (ev: MouseEvent) => {
		this.mouseDown = this.adjustDevicePoint({ x: ev.clientX, y: ev.clientY });

		if (this.isEditable) {
			this.dragRenderer = null;
			let point = this.viewToWorld(this.mouseDown);
			this.orderedRenderers.some(r => {
				if (r.handleClick(point, this.scale)) {
					this.dragRenderer = r;
					return true;
				}
				else {
					return false;
				}
			}, this);
		}

		ev.preventDefault();
	}

	private onMouseUp = (ev: MouseEvent) => {
		this.endDrag();
		ev.preventDefault();
	}

	private endDrag(): void {
		if (this.dragging) {
			if (this.dragRenderer) {
				this.dragRenderer.handleUp();
			}

			this.clearDragTimer();
			this.drawMap();
		}

		this.mouseDown = null;
		this.dragging = false;

		this.w_dragStartPt = null;
		this.w_dragStartCenterPt = null;
		this.dragTransform = null;

		this.dragRenderer = null;
	}

	private popupTimer: any;

	private onMouseMove = (ev: MouseEvent) => {
		this.clearPopupTimer();

		var mouseLocation = this.adjustDevicePoint({ x: ev.clientX, y: ev.clientY });
		if (this.dragging) {
			this.drag(mouseLocation);
		}
		else if (this.isDragStart(this.mouseDown, mouseLocation)) {
			this.dragging = true;

			this.dragTransform = new Matrix();
			// Inverse of the above
			this.dragTransform.Translate(this.w_centerPt.x, this.w_centerPt.y);
			this.dragTransform.Scale(1 / this.scale, 1 / this.scale);
			this.dragTransform.Translate(-this.containerWidth / 2, -this.containerHeight / 2);

			if (!this.dragRenderer) {
                this.w_dragStartPt = this.dragTransform.TransformPoint(mouseLocation);
                this.w_dragStartCenterPt = { x: this.w_centerPt.x, y: this.w_centerPt.y };
			}

			let drawStart = performance.now();
			this.drawMap();
			let drawEnd = performance.now();
			//console.log(`${drawEnd - drawStart} ms`);
			if ((drawEnd - drawStart) >= TopoMapComponent.DragTimerThreshold) {
				//console.log('Starting drag timer');
				this.dragTimer = setInterval(() => this.drawMap(), TopoMapComponent.DragTimerTimeout);
			}

			this.drag(mouseLocation);
		}

		var worldPoint = this.viewToWorld(mouseLocation);
		this.mouseOverLabels = [];
		this.orderedRenderers.forEach(r => {
			this.mouseOverLabels.push.apply(this.mouseOverLabels, r.getMouseOverLabels(worldPoint, this.scale));
		});

		this.drawPopups();

		this.popupTimer = setTimeout(this.handleHover, 700, mouseLocation);

		ev.preventDefault();
	}

	private isDragStart(mouseDown: Point, mouseLocation: Point): boolean {
		if (mouseDown === null) return false;
		var xMovement = Math.abs(mouseLocation.x - mouseDown.x);
		if (xMovement > TopoMapComponent.DragBuffer) return true;
		var yMovement = Math.abs(mouseLocation.y - mouseDown.y);
		if (yMovement > TopoMapComponent.DragBuffer) return true;
		return false;
	}

	private drag(mouseLocation: Point): void {
		let w_Pt = this.dragTransform.TransformPoint(mouseLocation);

		if (this.dragRenderer) {
			this.dragRenderer.handleMove(w_Pt, this.scale);
		}
		else {
			let w_deltaX = w_Pt.x - this.w_dragStartPt.x;
			let w_deltaY = w_Pt.y - this.w_dragStartPt.y;

			this.w_centerPt.x = this.w_dragStartCenterPt.x - w_deltaX;
			this.w_centerPt.y = this.w_dragStartCenterPt.y - w_deltaY;
		}

		if (!this.dragTimer) {
			this.drawMap();
		}
	}

	private handleHover = (mouseLocation: Point) => {

		if (this.scale < .1) {
			return;
		}

		var worldPoint = this.viewToWorld(mouseLocation);
		this.orderedRenderers.some(r => r.handleHover(worldPoint, mouseLocation));
	}

	private onContextMenu = (ev: MouseEvent) => {
		this.clearPopupTimer();

		var worldPoint = this.viewToWorld(this.adjustDevicePoint({ x: ev.clientX, y: ev.clientY }));
		if (!this.orderedRenderers.some(r => r.handleContextMenu(worldPoint, this.scale, ev))) {
			this.listener.onContextMenu("map", [], ev);
		}

		ev.preventDefault();
	}

	private clearPopupTimer() {
		if (!!this.popupTimer) {
			clearTimeout(this.popupTimer);
			this.popupTimer = null;
		}
	}

	private drawPopups() {
		if (this.scale >= .3) {
			var viewRect = this.container.getBoundingClientRect();

			this.overLay.width = viewRect.width;
			this.overLay.height = viewRect.height;

			var ctx: CanvasRenderingContext2D = this.overLay.getContext('2d');
			ctx.translate(this.containerWidth / 2, this.containerHeight / 2);
			ctx.scale(this.scale, this.scale);
			ctx.translate(-this.w_centerPt.x, -this.w_centerPt.y);

			this.drawLabels(ctx, this.mouseOverLabels, "#FFFFFF");
		}
	}

	private drawAllLabels(ctx: CanvasRenderingContext2D): void {
		this.drawLabels(ctx, this.allLabels);
	}

	private drawLabels(ctx: CanvasRenderingContext2D, labels: MouseOverLabel[], backgroundColor: string = null): void {

		let combinedLabels = [];
		labels.forEach((label) => {
			let found = combinedLabels.some((value: any) => {
				if (value.location.x == label.location.x &&
					value.location.y == label.location.y) {

					value.labels = value.labels.concat(label.labels);
					return true;
				}
				else {
					return false;
				}
			}, this);

			if (!found) {
				combinedLabels.push({
					location: label.location,
					labels: [...label.labels]
				});
			}
		}, this);

		combinedLabels.forEach((value) => {
			let display = "";
			value.labels.forEach((label) => {
				let trimmedLabel = label.trim();
				if (trimmedLabel) {
					if (display)
						display += ", ";
					display += trimmedLabel;
				}
			}, this);

			if (!display)
				display = " ";

			CanvasExtensions.drawLabel(ctx, value.location.x, value.location.y, display, backgroundColor);
		});
	}

	private onResize(): void {
		this.drawMap();
	}

	private get containerWidth(): number {
		return this.container.clientWidth;
	}

	private get containerHeight(): number {
		return this.container.clientHeight;
	}

	private scrollWorldPointToViewPoint(worldPoint: Point, viewPoint: Point): void {

		let newWorldPoint = this.viewToWorld(viewPoint);

		let w_xOffset = newWorldPoint.x - worldPoint.x;
		let w_yOffset = newWorldPoint.y - worldPoint.y;

		this.w_centerPt.x -= w_xOffset;
		this.w_centerPt.y -= w_yOffset;
	}

	public redraw(): void {
		this.drawMap();
	}

	private drawMap(): void {
		if (!TopoImageLibrary.isLoaded) return;

		if (this.canvas && this.map) {
			this.canvas.width = this.containerWidth;
			this.canvas.height = this.containerHeight;

			var ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
			ctx.translate(this.containerWidth / 2, this.containerHeight / 2);
			ctx.scale(this.scale, this.scale);
			ctx.translate(-this.w_centerPt.x, -this.w_centerPt.y);

			for (var i = this.orderedRenderers.length - 1; i >= 0; i--) {
				this.orderedRenderers[i].render(ctx);
			}

			if (this.map.layoutSettings.showLinkLabels) {
				this.drawAllLabels(ctx);
			}
		}
	}

	private scrollToCenter(): void {
		this.w_centerPt = this.worldMidPoint;
		this.drawMap();
	}

	public viewToWorld = (point: Point) => {
		return this.createInverseTransformMatrix().TransformPoint(point);
	}

	public worldToView = (point: Point) => {
		return this.createTransformMatrix().TransformPoint(point);
	}

	public createInverseTransformMatrix(): Matrix {
		var matrix = new Matrix();

		matrix.Translate(this.w_centerPt.x, this.w_centerPt.y);
		matrix.Scale(1 / this.scale, 1 / this.scale);
		matrix.Translate(-this.containerWidth / 2, -this.containerHeight / 2);

		return matrix;
	}

	public createTransformMatrix(): Matrix {
		var matrix = new Matrix();

		matrix.Translate(this.containerWidth / 2, this.containerHeight / 2);
		matrix.Scale(this.scale, this.scale);
		matrix.Translate(-this.w_centerPt.x, -this.w_centerPt.y);

		return matrix;
	}
}
