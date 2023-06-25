import Resources from "../../../experience/utils/Resources";
import { Experience } from "../../../experience/Experience";
import { Mesh, MeshStandardMaterial } from "three";
import { BlockCenterRight } from "./block";
import * as CANNON from "cannon";
import Character from "../Character";
import { PhysicsWorld } from "../../../experience/utils";

export default class City {
  private experience: Experience;
  private resources: Resources;
  public model: Mesh;
  blockCenterRight: BlockCenterRight;
  collectables: Mesh[] = [];
  keys: Mesh[] = [];
  physicsBodies: Mesh[] = [];
  character: Character;
  physics: PhysicsWorld;
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.character = this.experience.world.character;
    this.physics = this.experience.physics;

    this.createModel();
  }

  createModel() {
    // @ts-ignore
    this.model = this.resources.items.city.scene;

    this.model.traverse((child) => {
      if (
        child instanceof Mesh &&
        child.material instanceof MeshStandardMaterial
      ) {
        if (child.name.includes("collectable_")) {
          this.collectables.push(child);
        }
        if (child.name.includes("body_")) {
          this.physicsBodies.push(child);
        }
        if (child.name.includes("key_")) {
          this.keys.push(child);
        }

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.cityPhysicBodies();
  }

  cityPhysicBodies() {
    this.blockCenterRight = new BlockCenterRight();

    this.physicsBodies.forEach((item) => {
      item.visible = false;
      const boundingBox = item.geometry.boundingBox!;

      const size = new CANNON.Vec3(
        boundingBox.max.x - boundingBox.min.x,
        boundingBox.max.y - boundingBox.min.y,
        boundingBox.max.z - boundingBox.min.z
      );

      const shape = new CANNON.Box(new CANNON.Vec3().copy(size).scale(0.5));

      const body = new CANNON.Body({
        shape,
        mass: 0,
        type: CANNON.Body.KINEMATIC, // S
      });

      const position = item.position.clone();

      //@ts-ignore
      body.position.set(position.x, position.y, position.z);
      //@ts-ignore
      body.quaternion.copy(item.quaternion);

      this.physics.world.addBody(body);
    });
  }

  checkCollectables() {
    this.collectables.forEach((item) => {
      if (
        item.visible &&
        this.character.model.mesh.position.distanceTo(item.position) <= 0.4
      ) {
        var selectedObject = this.model.getObjectById(item.id);
        this.collectables = this.collectables.filter(
          (object) => object.id !== item.id
        );

        this.model.remove(selectedObject!);
      }
    });
  }

  update() {
    if (!this.character) return;
    if (this.collectables.length > 0) this.checkCollectables();
  }
}
