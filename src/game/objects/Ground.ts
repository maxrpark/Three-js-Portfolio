import CANNON, { Vec3 } from "cannon";
import { Experience } from "../../experience/Experience";
import { PhysicsWorld } from "../../experience/utils";

export default class Ground {
  private experience: Experience;
  private physics: PhysicsWorld;

  public baseAreaSize: number = 25;
  public infiniteGroundBody: CANNON.Body;

  constructor() {
    this.experience = new Experience();
    this.physics = this.experience.physics;
    this.setInfiniteBody();
  }
  private setInfiniteBody() {
    this.infiniteGroundBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
      position: new Vec3(0, -0.03, 0),
    });
    this.infiniteGroundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    this.physics.world.addBody(this.infiniteGroundBody);
  }
}
