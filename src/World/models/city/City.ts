import Resources from "../../../experience/utils/Resources";
import { Experience } from "../../../experience/Experience";
import { Mesh, MeshStandardMaterial } from "three";
// import { PhysicBody } from "../objects/PhysicBody";
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
  physicsBodies: Mesh[] = [];
  character: Character;
  physics: PhysicsWorld;
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.character = this.experience.world.character;
    this.physics = this.experience.physics;

    this.createModel();
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
        if (child.name.includes("collectable_")) {
          this.collectables.push(child);
        }
        if (child.name.includes("body_")) {
          this.physicsBodies.push(child);
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

      // body.collisionResponse = true;
      // body.collisionResponse = false;
      // body.isTrigger = false;

      const position = item.position.clone();

      //@ts-ignore
      body.position.set(position.x, position.y, position.z);
      //@ts-ignore
      body.quaternion.copy(item.quaternion);

      this.physics.world.addBody(body);
    });
  }

  // setColliders() {
  //   let raycaster = new Raycaster();

  //   const rayOrigin = this.character.model.mesh.position;
  //   const rayDirection = new Vector3(0, 0, 0); // Example: cast a ray

  //   this.character.model.mesh.getWorldDirection(rayDirection);
  //   rayDirection.normalize();

  //   raycaster.set(rayOrigin, rayDirection);

  //   const intersects = raycaster.intersectObjects(this.physicsBodies);

  //   if (intersects.length > 0) {
  //     if (intersects[0].distance < 1) {
  //       // do something

  //       this.experience.world.characterControllers.blocked = true;
  //     } else {
  //       this.experience.world.characterControllers.blocked = false;
  //     }
  //     return;
  //   }

  //   rayDirection.set(-3, 0, 0);
  //   rayDirection.applyMatrix4(this.character.model.mesh.matrix);
  //   rayDirection.normalize();
  //   raycaster = new Raycaster(rayOrigin, rayDirection);

  //   let intersectsLeft = raycaster.intersectObjects(this.physicsBodies);
  //   if (intersectsLeft.length > 0) {
  //     if (intersectsLeft[0].distance < 0.1) {
  //       // do something

  //       this.experience.world.characterControllers.blocked = true;
  //     } else {
  //       this.experience.world.characterControllers.blocked = false;
  //     }
  //     return;

  //     // this.player.object.translateX(50 - intersect[0].distance);
  //   }
  //   rayDirection.set(3, 0, 0);
  //   rayDirection.applyMatrix4(this.character.model.mesh.matrix);
  //   rayDirection.normalize();
  //   raycaster = new Raycaster(rayOrigin, rayDirection);

  //   let intersectsRight = raycaster.intersectObjects(this.physicsBodies);
  //   if (intersectsRight.length > 0) {
  //     if (intersectsRight[0].distance < 1) {
  //       // do something

  //       this.experience.world.characterControllers.blocked = true;
  //     } else {
  //       this.experience.world.characterControllers.blocked = false;
  //     }
  //     return;
  //   }
  // }

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
        console.log(this.collectables);

        this.model.remove(selectedObject!);
      }
    });
  }

  update() {
    if (!this.character) return;
    if (this.collectables.length > 0) this.checkCollectables();
    // if (this.collectables.length > 0) this.setColliders();
  }
}
