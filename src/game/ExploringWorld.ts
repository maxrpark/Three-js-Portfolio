import { Mesh } from "three";
import { Experience } from "../experience/Experience";
import { Character, City, Vehicle } from "./models";
import { StateMachine, StatesNames } from "./state/GameState";
import { CharacterController } from "./utils";
import UserProgress from "./UserProgress";
import { ItemTypeCollectable, ItemTypes } from "../ts/globalTs";
import { gsap } from "gsap";
import Water from "./shaders/water/Water";
import * as CANNON from "cannon";

export default class ExploringWorld {
  private experience: Experience;
  private stateMachine: StateMachine;
  private userProgress: UserProgress;
  private drivingButton: HTMLButtonElement;
  private speedButton: HTMLButtonElement;
  private infoButtons: HTMLDivElement;
  public controllers: CharacterController;
  showInfoButtons: boolean = true;
  character: Character;
  vehicle: Vehicle;

  city: City;

  isDriving: boolean = false;
  garageDoor: Mesh;

  timeLine: any;

  // Shader
  water: Water;

  constructor() {
    this.experience = new Experience();
    this.stateMachine = this.experience.stateMachine;
    this.city = this.experience.world.city;
    this.garageDoor = this.city.garageDoor;

    this.drivingButton = document.querySelector("#driveBtn")!;
    this.speedButton = document.querySelector("#runBtn")!;
    this.infoButtons = document.querySelector("#controlsInfo")!;
    this.showInfoButtons = true;

    gsap.set(this.infoButtons, {
      opacity: 0,
      yPercent: 100,
    });

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
    this.infoButtonsAnimation();

    this.experience.scene.add(
      this.vehicle.model.mesh,
      this.character.model.mesh
    );
  }

  infoButtonsAnimation() {
    let mm = gsap.matchMedia();
    this.timeLine = gsap.timeline({ paused: true });
    mm.add("(min-width: 687px)", () => {
      this.timeLine
        .to(this.infoButtons, {
          delay: 1,
          display: "block",
        })
        .to(this.infoButtons, {
          opacity: 1,
          yPercent: 0,
        });
    });
  }

  exportingStart() {
    this.timeLine.play();
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
      this.vehicle.model.mesh.position.x + 0.5,
      this.vehicle.model.mesh.position.y + 0.5,
      this.vehicle.model.mesh.position.z + 0.5
    );
    this.drivingButton.innerHTML = `
    <i class="fa-solid fa-car"></i>
    `;

    this.speedButton.innerHTML = `
    <i class="fa-solid fa-person-running"></i>
    `;
  }

  setDrivingMode() {
    this.userProgress.checkBadgesByID(11);

    this.controllers.keysPressed.Enter = false;
    this.character.model.mesh.visible = false;
    this.isDriving = true;
    this.drivingButton.innerHTML = `
    <i class="fa-solid fa-right-from-bracket"></i>
    `;
    this.speedButton.innerHTML = `
    <i class="fa-solid fa-truck-fast"></i>
    `;
  }
  checkCanDrive() {
    if (
      this.character.model.mesh.position.distanceTo(
        this.vehicle.model.mesh.position
      ) <= 1
    ) {
      this.drivingButton!.style.display = "block";
    } else if (
      !this.isDriving &&
      this.character.model.mesh.position.distanceTo(
        this.vehicle.model.mesh.position
      ) >= 1
    ) {
      this.drivingButton!.style.display = "none";
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
    this.character.model.position(-0.84, 0.35, -5.4);

    const carPosition = this.vehicle.model.body.position;
    const characterPosition = this.character.model.body.position;

    const direction = new CANNON.Vec3();
    direction.copy(carPosition).vsub(characterPosition).normalize();

    const angle = Math.atan2(direction.x, direction.z);
    this.character.model.body.quaternion.setFromEuler(0, angle, 0, "XYZ");
  }

  update() {
    this.water.update();

    if (this.stateMachine.currentStateName === StatesNames.EXPLORING) {
      if (this.isDriving) {
        this.vehicle.update();

        if (this.controllers.keysPressed.Enter && this.canDrive) {
          this.setWalkingMode();
        }
      } else {
        this.character.update();
        this.checkIsInsideMaze();

        if (this.controllers.keysPressed.Enter && this.canDrive) {
          this.setDrivingMode();
        }
      }
    }
    if (this.canDrive) {
      this.checkCanDrive();
      this.checkCharacterNearGarage();
    }
    if (this.stars.length) {
      this.checkItems(this.stars, ItemTypes.STAR);
    }
    if (this.coins.length) {
      this.checkItems(this.coins, ItemTypes.COIN);
    }
    if (this.diamonds.length) {
      this.checkItems(this.diamonds, ItemTypes.DIAMOND);
    }
    if (this.controllers.keysPressed.ArrowUp) {
      this.timeLine.reverse();
    }
  }
}
