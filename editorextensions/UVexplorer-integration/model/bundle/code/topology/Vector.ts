export class Vector {
	constructor(
		public x: number,
		public y: number) {

	}

	public sub(other: Vector): Vector {
		return new Vector(this.x - other.x, this.y - other.y);
	}

	public add(other: Vector): Vector {
		return new Vector(this.x + other.x, this.y + other.y);
	}

	public mult(other: Vector): Vector {
		return new Vector(this.x * other.x, this.y * other.y);
	}

	public equals(other: Vector): boolean {
		if (!other)
			return false;

		if (this === other)
			return true;

		return other.x === this.x && other.y === this.y;
	}
}
