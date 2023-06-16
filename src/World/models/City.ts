import Resources from "../../experience/utils/Resources";
import { Experience } from "../../experience/Experience";
import { Mesh, MeshStandardMaterial } from "three";
import { PhysicBody } from "../objects/PhysicBody";
import * as CANNON from "cannon";

export default class City {
  private experience: Experience;
  private resources: Resources;
  public model: Mesh;
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.createModel();
    this.cityBuildingBodies();
    // this.resources.on
  }

  createModel() {
    // @ts-ignore
    this.model = this.resources.items.city.scene;

    this.model.traverse((child) => {
      if (
        child instanceof Mesh &&
        child.material instanceof MeshStandardMaterial
      ) {
        // child.material.envMap = env

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.model.scale.set(0.5, 0.5, 0.5);
  }

  cityBuildingBodies() {
    const width = 3;
    const height = 1.5;
    const depth = 3;
    const xDirection = 4;
    const zDirection = 4;
    const block1 = new PhysicBody({
      width,
      height,
      depth,
      position: new CANNON.Vec3(xDirection, height * 0.5, zDirection),
    });
    const block2 = new PhysicBody({
      width,
      height,
      depth,
      position: new CANNON.Vec3(0, height * 0.5, zDirection),
    });
    const block3 = new PhysicBody({
      width,
      height,
      depth,
      position: new CANNON.Vec3(-xDirection, height * 0.5, zDirection),
    });
    // MIDDLE
    const block4 = new PhysicBody({
      width,
      height,
      depth,
      position: new CANNON.Vec3(-xDirection, height * 0.5, 0),
    });
    const block5 = new PhysicBody({
      width,
      height,
      depth,
      position: new CANNON.Vec3(xDirection, height * 0.5, 0),
    });
    // END
    const block6 = new PhysicBody({
      width,
      height,
      depth,
      position: new CANNON.Vec3(xDirection, height * 0.5, -zDirection),
    });
    const block7 = new PhysicBody({
      width,
      height,
      depth,
      position: new CANNON.Vec3(0, height * 0.5, -zDirection),
    });
    const block8 = new PhysicBody({
      width,
      height,
      depth,
      position: new CANNON.Vec3(-xDirection, height * 0.5, -zDirection),
    });

    this.experience.physics.world.addBody(block1.body);
    this.experience.physics.world.addBody(block2.body);
    this.experience.physics.world.addBody(block3.body);
    this.experience.physics.world.addBody(block4.body);
    this.experience.physics.world.addBody(block5.body);
    this.experience.physics.world.addBody(block6.body);
    this.experience.physics.world.addBody(block7.body);
    this.experience.physics.world.addBody(block8.body);
  }
}
