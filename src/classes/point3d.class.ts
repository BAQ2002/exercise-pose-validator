import { Landmark } from "@mediapipe/pose";
import CoordinatesSystem from "./coordinates-system.class";

type Point3dTuple = [number, number, number];

export default class Point3d {
  public x: number;
  public y: number;
  public z: number;

  constructor(
    landmark: Landmark | Point3dTuple,
    coordinatesSystem?: CoordinatesSystem
  ) {
    if (Array.isArray(landmark)) {
      this.x = landmark[0];
      this.y = landmark[1];
      this.z = landmark[2];
    } else {
      this.x = landmark.x;
      this.y = landmark.y;
      this.z = landmark.z;
    }

    if (!!coordinatesSystem) {
      return coordinatesSystem.convert(this);
    }
  }

  public getXYDistance(p2: Point3d) {
    return Math.sqrt((this.x - p2.x) ** 2 + (this.y - p2.y) ** 2);
  }

  public getMidPoint(p2: Point3d) {
    return new Point3d([
      (this.x + p2.x) / 2,
      (this.y + p2.y) / 2,
      (this.z + p2.z) / 2,
    ]);
  }

  public getAngle(p2?: Point3d, useAbs = false) {
    let deltaY = !!p2 ? p2.y - this.y : this.y;
    let deltaX = !!p2 ? p2.x - this.x : this.x;
    if (useAbs) {
      deltaY = Math.abs(deltaY);
      deltaX = Math.abs(deltaX);
    }
    const tang = deltaY / deltaX;
    return Math.atan(tang) * (180 / Math.PI);
  }

  public getAngle2(p2?: Point3d, useAbs = true) {
    let deltaY = !!p2 ? p2.y - this.y : this.y;
    let deltaX = !!p2 ? p2.x - this.x : this.x;
    if (useAbs) {
      deltaY = Math.abs(deltaY);
      deltaX = Math.abs(deltaX);
    }
    const tang = deltaY / deltaX;
    return Math.atan(tang) * (180 / Math.PI);
  }

  public subtract(p2: Point3d) {
    return new Point3d([this.x - p2.x, this.y - p2.y, this.z - p2.z]);
  }

  public crossProduct(p2: Point3d) {
    return new Point3d([
      this.y * p2.z - this.z * p2.y,
      this.z * p2.x - this.x * p2.z,
      this.x * p2.y - this.y * p2.x,
    ]);
  }

  public dotProduct(p2: Point3d) {
    return this.x * p2.x + this.y * p2.y + this.z * p2.z;
  }

  public getMagnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  public normalize() {
    const magnitude = this.getMagnitude();
    return new Point3d([
      this.x / magnitude,
      this.y / magnitude,
      this.z / magnitude,
    ]);
  }

  public toString(fractionDigits = 2) {
    return `(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(
      fractionDigits
    )}, ${this.z.toFixed(fractionDigits)})`;
  }
}
