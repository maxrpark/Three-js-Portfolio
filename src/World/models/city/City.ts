import Resources from "../../../experience/utils/Resources";
import { Experience } from "../../../experience/Experience";
import { Box3, Mesh, MeshStandardMaterial } from "three";
import { BlockCenterRight } from "./block";
import * as CANNON from "cannon";
import { PhysicsWorld } from "../../../experience/utils";
import { Item, ItemTypeCollectable, ItemTypes } from "../../../ts/globalTs";
import { gsap } from "gsap";

export default class City {
  private experience: Experience;
  private resources: Resources;
  public model: Mesh;
  blockCenterRight: BlockCenterRight;
  collectables: Mesh[] = [];
  keys: Mesh[] = [];
  physicsBodies: Mesh[] = [];
  physics: PhysicsWorld;
  mazeBox3: Box3;
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
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
        if (child.name.includes("maze")) {
          this.mazeBox3 = new Box3().setFromObject(child);
          // this.keys.push(child);
        }

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.cityPhysicBodies();

    this.model.position.y = -0.05;

    this.experience.scene.add(this.model);
  }

  removeItemFound(item: Mesh, type: ItemTypeCollectable) {
    let tl = gsap.timeline({});
    tl.to(item.position, {
      y: 1,
    })
      .to(
        item.scale,
        {
          x: 2,
          z: 2,
          y: 2,
        },
        0
      )
      .to(
        item.rotation,
        {
          y: 180,

          duration: 1,
        },
        0
      )
      .to(item.scale, {
        x: 0,
        z: 0,
        y: 0,
        onComplete: () => {
          this.model.remove(this.model.getObjectByName(item.name)!);
        },
      });

    switch (type) {
      case ItemTypes.FRUIT:
        this.collectables = this.collectables.filter(
          (object) => object.name !== item.name
        );
        break;
      case ItemTypes.KEY:
        this.keys = this.keys.filter((object) => object.name !== item.name);
        break;

      default:
        break;
    }
  }

  onLoadRemoveCollectedItems(array: Item[]) {
    [...this.collectables, ...this.keys].map((item) => {
      if (array.find((el) => el.name === item.name && el.isCollected)) {
        item.visible = false;
        this.model.remove(item!);
      }
      return item;
    });
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
}
