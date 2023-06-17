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
    // this.model.scale.set(0.5, 0.5, 0.5);
  }

  cityBuildingBodies() {
    const width = 6;
    const height = 1.5;
    const depth = 6;
    const xDirection = 8;
    const zDirection = 8;
    // const bottomRight = new PhysicBody({
    //   width,
    //   height,
    //   depth,
    //   position: new CANNON.Vec3(xDirection, height * 0.5, zDirection),
    // });

    const shape = new CANNON.Box(
      new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
    );

    const bottomRight = new CANNON.Body({
      shape,
      mass: 0,
      position: new CANNON.Vec3(xDirection, height * 0.5, zDirection),
    });

    const bottomCenter = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(3.8 * 0.5, 0.5 * 0.5, 0.8 * 0.5)),
      mass: 0,
      position: new CANNON.Vec3(0, 0.5 * 0.5, zDirection),
    });

    const bottomLeft = new CANNON.Body({
      shape,
      mass: 0,
      position: new CANNON.Vec3(-xDirection, height * 0.5, zDirection),
    });
    // MIDDLE
    const centerLeft = new CANNON.Body({
      shape,
      mass: 0,
      position: new CANNON.Vec3(-xDirection, height * 0.5, 0),
    });
    const centerRight = new CANNON.Body({
      shape,
      mass: 0,
      position: new CANNON.Vec3(xDirection, height * 0.5, 0),
    });
    // END
    const topRight = new CANNON.Body({
      shape,
      mass: 0,
      position: new CANNON.Vec3(xDirection, height * 0.5, -zDirection),
    });
    const topCenter = new CANNON.Body({
      shape,
      mass: 0,
      position: new CANNON.Vec3(0, height * 0.5, -zDirection),
    });
    const topLeft = new CANNON.Body({
      shape,
      mass: 0,
      position: new CANNON.Vec3(-xDirection, height * 0.5, -zDirection),
    });

    this.experience.physics.world.addBody(bottomLeft);
    this.experience.physics.world.addBody(bottomRight);
    this.experience.physics.world.addBody(bottomCenter);
    this.experience.physics.world.addBody(centerLeft);
    this.experience.physics.world.addBody(centerRight);
    this.experience.physics.world.addBody(topLeft);
    this.experience.physics.world.addBody(topRight);
    this.experience.physics.world.addBody(topCenter);
  }
}
