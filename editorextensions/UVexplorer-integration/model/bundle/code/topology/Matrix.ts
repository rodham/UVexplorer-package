import { Point } from '../dtos/topology/Point';


export class CGAffineTransform {
	public xx: number;   // a
	public yx: number;   // b
	public xy: number;   // c
	public yy: number;   // d
	public x0: number;   // tx
	public y0: number;   // ty

	constructor(xx: number, yx: number, xy: number, yy: number, x0: number, y0: number) {
		this.xx = xx;
		this.yx = yx;
		this.xy = xy;
		this.yy = yy;
		this.x0 = x0;
		this.y0 = y0;
	}

	public static MakeIdentity(): CGAffineTransform {
		return new CGAffineTransform(1, 0, 0, 1, 0, 0);
	}

	public static MakeRotation(angle: number): CGAffineTransform {
		return new CGAffineTransform(
			Math.cos(angle), Math.sin(angle),
			- Math.sin(angle), Math.cos(angle),
			0, 0);
	}

	public static MakeScale(sx: number, sy: number): CGAffineTransform {
		return new CGAffineTransform(sx, 0, 0, sy, 0, 0);
	}

	public static MakeTranslation(tx: number, ty: number): CGAffineTransform {
		return new CGAffineTransform(1, 0, 0, 1, tx, ty);
	}

	public Multiply(b: CGAffineTransform): void {
		var a = this;
		this.xx = a.xx * b.xx + a.yx * b.xy;
		this.yx = a.xx * b.yx + a.yx * b.yy;
		this.xy = a.xy * b.xx + a.yy * b.xy;
		this.yy = a.xy * b.yx + a.yy * b.yy;
		this.x0 = a.x0 * b.xx + a.y0 * b.xy + b.x0;
		this.y0 = a.x0 * b.yx + a.y0 * b.yy + b.y0;
	}
}

export enum MatrixOrder { Prepend, Append }

export class Matrix {
	private transform: CGAffineTransform;

	constructor() {
		this.transform = CGAffineTransform.MakeIdentity();
	}

	public get Elements(): number[] {
		return [this.transform.xx, this.transform.yx, this.transform.xy, this.transform.yy, this.transform.x0, this.transform.y0];
	}

	public Reset(): void {
		this.transform = CGAffineTransform.MakeIdentity();
	}


	public Rotate(angle: number, order: MatrixOrder = MatrixOrder.Prepend): void {
		angle *= (Math.PI / 180.0);  // degrees to radians
		var affine = CGAffineTransform.MakeRotation(angle);
		if (order == MatrixOrder.Append)
			this.transform.Multiply(affine);
		else {
			affine.Multiply(this.transform);
			this.transform = affine;
		}
	}

	public Scale(scaleX: number, scaleY: number, order: MatrixOrder = MatrixOrder.Prepend): void {
		var affine = CGAffineTransform.MakeScale(scaleX, scaleY);
		if (order == MatrixOrder.Append)
			this.transform.Multiply(affine);
		else {
			affine.Multiply(this.transform);
			this.transform = affine;
		}
	}

	public TransformPoint(point: Point): Point {
		point = { x: Math.round(this.transform.xx * point.x + this.transform.xy * point.y + this.transform.x0),
			y: Math.round(this.transform.yx * point.x + this.transform.yy * point.y + this.transform.y0)};

		return point;
	}

	public TransformPoints(pts: Point[]): void {
		if (pts) {
			for (var i = 0; i < pts.length; i++) {
				var point = pts[i];
				pts[i] = { x: Math.round(this.transform.xx * point.x + this.transform.xy * point.y + this.transform.x0),
					y: Math.round(this.transform.yx * point.x + this.transform.yy * point.y + this.transform.y0)};
			}
		}
	}

	public Translate(offsetX: number, offsetY: number, order: MatrixOrder = MatrixOrder.Prepend): void {
		var affine = CGAffineTransform.MakeTranslation(offsetX, offsetY);
		if (order === MatrixOrder.Append)
			this.transform.Multiply(affine);
		else {
			affine.Multiply(this.transform);
			this.transform = affine;
		}
	}
}
