import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import CANNON from "cannon";
import { Experience } from "../../experience/Experience";
import { PhysicsWorld, Time } from "../../experience/utils";

export default class GroundFloor {
  experience: Experience;
  time: Time;
  geometry: BoxGeometry;
  material: MeshStandardMaterial;
  mesh: Mesh;

  towerBody: CANNON.Body;
  physics: PhysicsWorld;

  positionY: number;
  constructor() {
    this.experience = new Experience();
    this.physics = this.experience.physics;

    this.createMesh();
    this.setBody();
  }
  setGeometry() {
    this.geometry = new BoxGeometry(1, 1, 1);
  }
  setMaterial() {
    this.material = new MeshStandardMaterial();
  }
  setBody() {
    this.towerBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 0.5, 0),
      shape: new CANNON.Box(new CANNON.Vec3(1 * 0.5, 1 * 0.5, 1 * 0.5)),
      allowSleep: true, // Enable sleeping
      sleepSpeedLimit: 0.1,
    });

    this.physics.world.addBody(this.towerBody);
  }

  createMesh() {
    this.setGeometry();
    this.setMaterial();
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.y = 0.5;
  }
}
