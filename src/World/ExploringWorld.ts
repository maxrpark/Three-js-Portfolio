import { Mesh } from "three";
import { Experience } from "../experience/Experience";
import { Character, City, Vehicle } from "./models";
import { StateMachine, StatesNames } from "./state/GameState";
import { CharacterController } from "./utils";

export class ExploringWorld {
  public controllers: CharacterController;
  private experience: Experience;
  private stateMachine: StateMachine;
  character: Character;
  vehicle: Vehicle;

  city: City;
  collectables: Mesh[];

  //
  canDrive: boolean = false;
  isDriving: boolean = false;

  constructor() {
    this.experience = new Experience();
    this.stateMachine = this.experience.stateMachine;
    this.city = this.experience.world.city;
    this.collectables = this.city.collectables;

    this.setExploration();
  }

  setExploration() {
    this.controllers = new CharacterController();
    this.character = new Character(this.controllers);
    this.vehicle = new Vehicle(this.controllers);

    this.experience.scene.add(
      this.vehicle.model.mesh,
      this.character.model.mesh
    );
  }

  setWalkingMode() {
    this.controllers.keysPressed.Enter = false;
    this.character.model.mesh.visible = true;
    this.isDriving = false;
    this.character.model.position(
      this.vehicle.model.mesh.position.x + 0.5,
      this.vehicle.model.mesh.position.y + 0.5,
      this.vehicle.model.mesh.position.z
    );
  }

  setDrivingMode() {
    this.controllers.keysPressed.Enter = false;
    this.character.model.mesh.visible = false;
    this.isDriving = true;
  }
  checkCanDrive() {
    if (
      this.character.model.mesh.position.distanceTo(
        this.vehicle.model.mesh.position
      ) <= 1
    ) {
      document.getElementById("driveBtn")!.style.display = "block";
      // this.isDriving = true;
    } else {
      // document.getElementById("driveBtn")!.style.display = "none";
      // this.isDriving = false;
    }
  }

  checkCollectables() {
    this.collectables.forEach((item) => {
      if (
        item.visible &&
        this.character.model.mesh.position.distanceTo(item.position) <= 0.4
      ) {
        var selectedObject = this.city.model.getObjectById(item.id);
        this.collectables = this.collectables.filter(
          (object) => object.id !== item.id
        );

        this.city.model.remove(selectedObject!);
      }
    });
  }

  update() {
    this.checkCanDrive();
    if (this.stateMachine.currentStateName === StatesNames.EXPLORING) {
      if (this.isDriving) {
        this.vehicle.update();

        if (this.controllers.keysPressed.Enter) {
          this.setWalkingMode();
        }
      } else {
        this.character.update();

        if (this.controllers.keysPressed.Enter) {
          this.setDrivingMode();
        }
      }
    }
    if (this.collectables.length) {
      this.checkCollectables();
    }
  }
}
