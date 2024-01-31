import { Point } from '../dtos/topology/Point';
import { Vector } from './Vector';


export class CanvasExtensions {
	public static drawLabel(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, backgroundColor: string = null): void {
		var textMetrics = ctx.measureText(label);

		var fontSize = parseInt(ctx.font);
		x -= textMetrics.width / 2;
		y -= (fontSize / 2);

		if (backgroundColor) {
			var fillStyleCache = ctx.fillStyle;
			ctx.fillStyle = backgroundColor;
			//ctx.fillRect(x - 2, y - fontSize, textMetrics.width + 4, fontSize + 4);
			CanvasExtensions.roundRect(ctx, x-2, y-fontSize, textMetrics.width + 4, fontSize + 4, 3, true, true);
			ctx.fillStyle = fillStyleCache;
		}

		ctx.fillText(label, x, y);
	}
		
	public static isLineHit(start: Point, end: Point, point: Point, hitMargin: number): boolean {
		var a = new Vector(start.x, start.y);
		var b = new Vector(end.x, end.y);

		// If start equals end this is a point not a line
		// Short circuit here to ensure we don't divide by zero
		if (a.sub(b).equals(new Vector(0, 0))) {
			if (CanvasExtensions.distance(start, point) < hitMargin)
				return true;
			else
				return false;
		}
			
		// Line test using Parametric equation of line
		// Equation finds the nearest point on the line but the
		// Point is only on the segment if 't' is between 1 and 0
		var t = (-((a.x - point.x) * (b.x - a.x)) - ((a.y - point.y) * (b.y - a.y))) /
			(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

		var vt = new Vector(t, t);
		var l = a.add(vt.mult(b.sub(a)));

		var nearestLinePoint: Point = { x: l.x, y: l.y };

		var dist = CanvasExtensions.distance(point, nearestLinePoint);

		if ((t > 0 && t < 1) && dist < hitMargin)
			return true;
		else
			return false;
	}

	public static distance(a: Point, b: Point): number {
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	}

	public static midPoint(a: Point, b: Point): Point {
		return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
	}

	public static roundRect(ctx, x, y, width, height, radius, fill, stroke) {
		if (typeof stroke == 'undefined') {
			stroke = true;
		}
		if (typeof radius === 'undefined') {
			radius = 5;
		}
		if (typeof radius === 'number') {
			radius = { tl: radius, tr: radius, br: radius, bl: radius };
		} else {
			var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
			for (var side in defaultRadius) {
				radius[side] = radius[side] || defaultRadius[side];
			}
		}
		ctx.beginPath();
		ctx.moveTo(x + radius.tl, y);
		ctx.lineTo(x + width - radius.tr, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		ctx.lineTo(x + width, y + height - radius.br);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		ctx.lineTo(x + radius.bl, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		ctx.lineTo(x, y + radius.tl);
		ctx.quadraticCurveTo(x, y, x + radius.tl, y);
		ctx.closePath();
		if (fill) {
			ctx.fill();
		}
		if (stroke) {
			ctx.stroke();
		}
	}
}
