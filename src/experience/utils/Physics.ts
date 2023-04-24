import CANNON from "cannon";
import { Experience } from "../Experience";
import { Time } from "./Time";

export default class PhysicsWorld {
  experience: Experience;
  time: Time;
  world: CANNON.World;
  defaultMaterial: CANNON.Material;
  defaultContactMaterial: CANNON.ContactMaterial;
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;

    this.createWorld();
  }

  createContact() {
    this.defaultMaterial = new CANNON.Material("concrete");

    this.defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 1,
        restitution: 0,
      }
    );
  }

  createWorld() {
    this.createContact();
    this.world = new CANNON.World();

    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.allowSleep = true;
    this.world.gravity.set(0, -9.82, 0);
    this.world.addContactMaterial(this.defaultContactMaterial);
    this.world.defaultContactMaterial = this.defaultContactMaterial;
  }

  update() {
    this.world.step(1 / 120, this.time.delta, 3);
  }
}
