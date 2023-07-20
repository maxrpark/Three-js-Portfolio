import Resources from "../../../experience/utils/Resources";
import { Experience } from "../../../experience/Experience";
import { Box3, Mesh, MeshStandardMaterial, Texture, BoxGeometry } from "three";
import { BlockCenterRight } from "./block";
import * as CANNON from "cannon";
import { PhysicsWorld } from "../../../experience/utils";
import { Item, ItemTypeCollectable, ItemTypes } from "../../../ts/globalTs";
import { gsap } from "gsap";

gsap.registerEffect({
  name: "itemRotate",
  defaults: {},
  effect: (targets: Mesh[], config: { duration: string }) => {
    const { duration } = config;
    const mesh = targets[0];

    let tl = gsap.timeline();
    tl.to(mesh.rotation, {
      y: Math.PI * 2,
      duration,
      repeat: -1,
      ease: "none",
    });
    return tl;
  },
});

export default class City {
  private experience: Experience;
  private resources: Resources;
  public model: Mesh;
  blockCenterRight: BlockCenterRight;
  stars: Mesh[] = [];
  diamonds: Mesh[] = [];
  coins: Mesh[] = [];
  physicsBodies: Mesh[] = [];
  physics: PhysicsWorld;
  mazeBox3: Box3;
  garageDoor: Mesh;

  garageBody: CANNON.Body;
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
        if (child.name.includes("body_")) {
          this.physicsBodies.push(child);
          child.visible = false;
        }
        if (child.name.includes("star_")) {
          this.stars.push(child);
          gsap.effects.itemRotate(child, { duration: 2 });
        }
        if (child.name.includes("coin_")) {
          this.coins.push(child);
          gsap.effects.itemRotate(child, { duration: 2 });
        }
        if (child.name.includes("diamond_")) {
          this.diamonds.push(child);
          gsap.effects.itemRotate(child, { duration: 2 });
        }
        if (child.name.startsWith("maze")) {
          this.mazeBox3 = new Box3().setFromObject(child);
        }
        if (child.name === "floor_base") {
          this.physicsBodies.push(child);

          const material = new MeshStandardMaterial({
            map: this.resources.items.towerFloorColor as Texture,
          });

          const mesh = new Mesh(new BoxGeometry(1, 1, 1), material);
          mesh.position.copy(child.position);
          this.experience.scene.add(mesh);
          child.visible = false;

          this.experience.scene.remove(child);
        }
        if (child.name.startsWith("garage_door")) {
          this.garageDoor = child;
        }

        child.castShadow = true;
        child.receiveShadow = true;
        if (child.name.includes("maxi_ruti")) {
          // gsap.effects.itemRotate(child, { duration: 30 });

          gsap.to(child.rotation, {
            z: Math.PI * 2,
            duration: 30,
            repeat: -1,
            ease: "none",
          });
          child.castShadow = false;
          child.receiveShadow = false;
        }
      }
    });
    this.cityPhysicBodies();

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
      case ItemTypes.STAR:
        this.stars = this.stars.filter((object) => object.name !== item.name);
        break;
      case ItemTypes.COIN:
        this.coins = this.coins.filter((object) => object.name !== item.name);
        break;
      case ItemTypes.DIAMOND:
        this.diamonds = this.diamonds.filter(
          (object) => object.name !== item.name
        );
        break;

      default:
        break;
    }
  }

  removeBody(body = this.garageBody) {
    this.physics.world.remove(body);
  }

  onLoadRemoveCollectedItems(array: Item[]) {
    [...this.coins, ...this.stars, ...this.diamonds].map((item) => {
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
        type: CANNON.Body.KINEMATIC,
      });

      const position = item.position.clone();

      body.position.set(position.x, position.y, position.z);

      body.quaternion.copy(item.quaternion as any);

      this.physics.world.addBody(body);

      if (item.name === "body_door_garage") {
        this.garageBody = body;
      }
    });
  }
}
