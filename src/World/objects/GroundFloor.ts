import { BoxGeometry, Mesh, MeshMatcapMaterial } from "three";
import CANNON from "cannon";
import { Experience } from "../../experience/Experience";
import { PhysicsWorld, Time } from "../../experience/utils";

interface Props {
  positionY: number;
}
export default class GroundFloor {
  experience: Experience;
  time: Time;
  geometry: BoxGeometry;
  material: MeshMatcapMaterial;
  mesh: Mesh;

  towerBody: CANNON.Body;
  physics: PhysicsWorld;

  //

  positionY: number;
  constructor(props?: Props) {
    Object.assign(this, props);
    this.experience = new Experience();

    this.physics = this.experience.physics;

    this.createMesh();
  }
  setGeometry() {
    this.geometry = new BoxGeometry(1, 1, 1);
  }
  setMaterial() {
    const matcap = this.experience.resources.items.mapCap8;
    this.material = new MeshMatcapMaterial({
      // @ts-ignore TODO
      matcap,
    });
  }
  setBody() {
    const shape = new CANNON.Box(new CANNON.Vec3(1 * 0.5, 1 * 0.5, 1 * 0.5));

    this.towerBody = new CANNON.Body({
      mass: 10,
      position: new CANNON.Vec3(0, 0.5, 0),
      shape,
      allowSleep: true, // Enable sleeping
      sleepSpeedLimit: 0.1,
    });

    this.physics.world.addBody(this.towerBody);
  }

  createMesh() {
    this.setGeometry();
    this.setMaterial();
    this.setBody();
    this.mesh = new Mesh(this.geometry, this.material);
    // this.mesh.position.set(0, this.positionY + 2, 0);

    this.mesh.position.x = this.towerBody.position.x;
    this.mesh.position.y = 0.5;
    this.mesh.position.z = this.towerBody.position.z;
  }
}
