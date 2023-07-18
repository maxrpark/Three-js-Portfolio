import { Mesh } from "three";
import { Experience } from "../experience/Experience";
import { Character, City, Vehicle } from "./models";
import { StateMachine, StatesNames } from "./state/GameState";
import { CharacterController } from "./utils";
import UserProgress from "./UserProgress";
import { ItemTypeCollectable, ItemTypes } from "../ts/globalTs";
import { gsap } from "gsap";
import Water from "./shaders/water/Water";

export default class ExploringWorld {
  public controllers: CharacterController;
  private experience: Experience;
  private stateMachine: StateMachine;
  private userProgress: UserProgress;
  character: Character;
  vehicle: Vehicle;

  city: City;

  isDriving: boolean = false;
  garageDoor: Mesh;

  // Shader
  water: Water;

  constructor() {
    this.experience = new Experience();
    this.stateMachine = this.experience.stateMachine;
    this.city = this.experience.world.city;
    this.garageDoor = this.city.garageDoor;

    this.userProgress = this.experience.world.userProgress;

    this.setExploration();
  }

  get canDrive() {
    return this.userProgress.canDrive;
  }
  get stars() {
    return this.city.stars;
  }
  get coins() {
    return this.city.coins;
  }
  get diamonds() {
    return this.city.diamonds;
  }

  setExploration() {
    this.setWater();
    this.controllers = new CharacterController();
    this.character = new Character(this.controllers);
    this.vehicle = new Vehicle(this.controllers);

    this.experience.scene.add(
      this.vehicle.model.mesh,
      this.character.model.mesh
    );
  }

  setWater() {
    this.water = new Water();
    this.experience.scene.add(this.water.mesh);
  }

  setWalkingMode() {
    this.controllers.keysPressed.Enter = false;
    this.character.model.mesh.visible = true;
    this.isDriving = false;
    this.character.model.position(
      this.vehicle.model.mesh.position.x + 0.7,
      this.vehicle.model.mesh.position.y + 0.7,
      this.vehicle.model.mesh.position.z + 0.7
    );
  }

  setDrivingMode() {
    this.userProgress.checkBadgesByID(11);

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

  checkItems(array: Mesh[], type: ItemTypeCollectable) {
    array.forEach((item) => {
      if (
        item.visible &&
        this.character.model.mesh.position.distanceTo(item.position) <= 0.4
      ) {
        this.city.removeItemFound(item, type);

        this.userProgress.itemCollected(type, item.name);
      }
    });
  }

  checkIsInsideMaze() {
    const isCharacterNear =
      this.city.mazeBox3.distanceToPoint(this.character.model.mesh.position) <=
      0.4;
    if (isCharacterNear) {
      this.character.isAroundMaze = true;
    } else {
      this.character.isAroundMaze = false;
    }
  }
  checkCharacterNearGarage() {
    if (this.isDriving)
      if (
        this.vehicle.model.mesh.position.distanceTo(
          this.city.garageDoor.position
        ) <= 4
      ) {
        gsap.to(this.city.garageDoor.position, { y: 2 });
      } else {
        gsap.to(this.city.garageDoor.position, { y: 0.7 });
      }
    else {
      if (
        this.character.model.mesh.position.distanceTo(
          this.city.garageDoor.position
        ) <= 4
      ) {
        gsap.to(this.city.garageDoor.position, { y: 2 });
      } else {
        gsap.to(this.city.garageDoor.position, { y: 0.7 });
      }
    }
  }

  userCanDrive() {
    this.character.model.position(-0.85, 0, -12);
    this.character.model.body.quaternion.copy(
      this.vehicle.model.body.quaternion
    );
  }

  update() {
    this.water.update();
    this.checkCanDrive();
    if (this.stateMachine.currentStateName === StatesNames.EXPLORING) {
      if (this.isDriving) {
        this.vehicle.update();

        if (this.controllers.keysPressed.Enter) {
          this.setWalkingMode();
        }
      } else {
        this.character.update();
        this.checkIsInsideMaze();

        if (this.controllers.keysPressed.Enter) {
          this.setDrivingMode();
        }
      }
    }
    if (this.canDrive) this.checkCharacterNearGarage();
    if (this.stars.length) {
      this.checkItems(this.stars, ItemTypes.STAR);
    }
    if (this.coins.length) {
      this.checkItems(this.coins, ItemTypes.COIN);
    }
    if (this.diamonds.length) {
      this.checkItems(this.diamonds, ItemTypes.DIAMOND);
    }
  }
}
