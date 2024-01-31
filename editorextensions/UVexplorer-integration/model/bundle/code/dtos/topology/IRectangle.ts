import { Point } from './Point';

export interface IRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Rectangle {
    public static contains(rectangle: IRectangle, point: Point): boolean {
        return (
            point.x >= rectangle.x &&
            point.x <= rectangle.x + rectangle.width &&
            point.y >= rectangle.y &&
            point.y <= rectangle.y + rectangle.height
        );
    }
}
