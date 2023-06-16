import * as CANNON from "cannon";

interface Props {
  width: number;
  height: number;
  depth: number;
  position: CANNON.Vec3;
}
export class PhysicBody {
  body: CANNON.Body;

  width: number;
  height: number;
  depth: number;
  position: CANNON.Vec3;

  constructor(props?: Props) {
    Object.assign(this, props);
    this.createBody();
  }

  createBody() {
    this.body = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(this.width * 0.5, this.height * 0.5, this.depth * 0.5)
      ),
      position: this.position,
      mass: 0,
    });
  }
}
