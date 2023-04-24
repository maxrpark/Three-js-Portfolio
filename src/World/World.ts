import { Camera, Group } from "three";
import { Experience } from "../experience/Experience";
import { Environment } from "./Environment";
import { TowerFloor, GroundArea, GroundFloor } from "./objects";
import Debug from "../experience/utils/Debug";
import GUI from "lil-gui";
import { PhysicsWorld } from "../experience/utils";
import { gsap } from "gsap";

export default class World {
  experience: Experience;
  environment: Environment;
  camera: Camera;
  physics: PhysicsWorld;
  world: Group;
  tower: Group;
  addedObjects: TowerFloor[];
  ground: GroundArea;
  groundFloor: GroundFloor;
  debug: Debug;
  debugFolder: GUI;
  floorY: number;
  currentFloor: TowerFloor;

  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera.camera;
    this.debug = this.experience.debug;
    this.physics = this.experience.physics;
    this.environment = new Environment({
      hasAmbientLight: true,
      hasDirectionalLight: true,
    });

    this.tower = new Group();
    this.world = new Group();

    this.addedObjects = [];
    this.floorY = 2;

    this.createWorld();
    this.debugPanel();
  }

  addFloor() {
    if (this.currentFloor) this.floorY = this.currentFloor.mesh.position.y;

    this.currentFloor = new TowerFloor({ positionY: this.floorY });
    this.currentFloor.on("handleHasCollided", () => {
      this.addedObjects.push(this.currentFloor);
      this.addFloor();
    });

    this.tower.add(this.currentFloor.mesh);
  }
  createGroundArea() {
    this.groundFloor = new GroundFloor();
    this.ground = new GroundArea();
  }
  createWorld() {
    this.createGroundArea();
    this.addFloor();

    this.world.add(this.tower, this.groundFloor.mesh, this.ground.mesh);
    this.experience.scene.add(this.world);

    gsap.to(this.camera.position, {
      y: 3,
      duration: 1,
    });
  }

  debugPanel() {
    const debugProps = {
      reset: () => this.reset(),
      drop: () => {
        if (this.currentFloor && this.currentFloor.isFalling) return;
        this.currentFloor.drop();
      },
    };

    this.debugFolder = this.debug.ui.addFolder("towers");
    this.debugFolder.add(debugProps, "reset");
    this.debugFolder.add(debugProps, "drop");
  }

  update() {}

  reset() {
    for (const object of this.addedObjects) {
      object.remove();
      this.physics.world.remove(object.body);
      this.tower.remove(object.mesh);
    }
    this.addedObjects.splice(0, this.addedObjects.length);
  }
}
