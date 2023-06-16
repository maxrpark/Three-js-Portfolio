import CANNON from "cannon";
import { Experience } from "../../experience/Experience";
import { PhysicsWorld } from "../../experience/utils";

export default class Ground {
  private experience: Experience;
  private physics: PhysicsWorld;

  public baseAreaSize: number = 25;
  // public groundBody: CANNON.Body;
  public infiniteGroundBody: CANNON.Body;

  constructor() {
    this.experience = new Experience();
    this.physics = this.experience.physics;
    this.setInfiniteBody();
    // this.setBaseAreaBody();
  }
  private setInfiniteBody() {
    this.infiniteGroundBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
    });
    this.infiniteGroundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    this.physics.world.addBody(this.infiniteGroundBody);
  }
  // private setBaseAreaBody() {
  // this.groundBody = new CANNON.Body({
  //   mass: 0,
  //   shape: new CANNON.Box(
  //     new CANNON.Vec3(
  //       this.baseAreaSize * 0.5,
  //       this.baseAreaSize * 0.5,
  //       0.1 * 0.5
  //     )
  //   ),
  // });
  // this.groundBody.quaternion.setFromAxisAngle(
  //   new CANNON.Vec3(-1, 0, 0),
  //   Math.PI * 0.5
  // );
  // this.physics.world.addBody(this.groundBody);
  // }
}
