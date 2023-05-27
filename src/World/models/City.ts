import Resources from "../../experience/utils/Resources";
import { Experience } from "../../experience/Experience";
import { Mesh, MeshStandardMaterial } from "three";

export default class City {
  private experience: Experience;
  private resources: Resources;
  public model: Mesh;
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.createModel();
    // this.resources.on
  }

  createModel() {
    // @ts-ignore
    this.model = this.resources.items.model.scene;
    this.model.position.y = -0.51;

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
  }
}
