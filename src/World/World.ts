import { Group } from "three";
import { Experience } from "../experience/Experience";
import { Environment } from "./Environment";
import { Debug, PhysicsWorld } from "../experience/utils";

import GUI from "lil-gui";
import { gsap } from "gsap";

import { TowerFloor, Ground, GroundFloor, Text2D } from "./objects";

import { StateMachine, StatesNames } from "./state/GameState";
import {
  GameOverState,
  IntroState,
  WorldCreationState,
  ExploringState,
} from "./state/states";
import { Controllers, Modal, MenuIcon, LoadingModal } from "./utils/";
// import Water from "./shaders/water/Water";

import { City, Character } from "./models";

export default class World {
  private experience: Experience;
  public environment: Environment;
  private physics: PhysicsWorld;
  public stateMachine: StateMachine;

  //
  public debug: Debug;
  public debugFolder: GUI;

  // world elements
  private world: Group = new Group();
  private tower: Group = new Group();
  private groundFloor: GroundFloor;
  ground: Ground;
  private floorLevel: Text2D;
  // public water: Water;

  private addedObjects: TowerFloor[] = [];

  // Intro Screen and Modal
  public loadingModal: LoadingModal;
  public modal: Modal;

  // 3D Model
  private city: City;
  private character: Character;

  // Controls and Icons
  public menuIcon: MenuIcon;
  public controllers: Controllers;
  public currentFloor: TowerFloor | null;

  // Variables
  private floorY: number = 1;
  public isGameOver: boolean = false;
  public score: number = 0;
  private floorSize: number = 1;

  constructor() {
    this.experience = new Experience();
    this.stateMachine = this.experience.stateMachine;
    this.physics = this.experience.physics;
    this.environment = new Environment({
      hasAmbientLight: true,
      hasDirectionalLight: true,
      castShadow: true,
    });

    // this.setLoadingScreen();

    this.experience.resources.on("loaded", () => {
      // this.loadingModal.progressModalOut(); // COMMENTED DURING DEVELOPENT
      this.stateMachine.change(new WorldCreationState());
    });
  }

  private set floorPositionY(value: number) {
    this.floorY = value;
  }

  private get floorPositionY(): number {
    return this.floorY;
  }

  private set setGameOver(value: boolean) {
    this.isGameOver = value;
  }

  private set setScore(value: number) {
    this.score = value;
  }

  public get getScore(): number {
    return this.score;
  }

  // STATES ACTIONS

  public createWorld() {
    if (this.stateMachine.currentStateName !== StatesNames.CREATION) return;

    this.city = new City();
    this.character = new Character();
    this.groundFloor = new GroundFloor({ floorSize: this.floorSize });
    this.ground = new Ground();
    this.menuIcon = new MenuIcon();
    this.controllers = new Controllers();
    this.floorLevel = new Text2D({
      text: 0,
      anchorX: -1.5,
      fontSize: 1,
      visible: false,
    });

    this.createModal();
    this.setupCollisionListeners();

    this.world.add(
      this.tower,
      this.groundFloor.mesh,
      // @ts-ignore
      this.floorLevel.instance,
      this.city.model,
      this.character.model.mesh
    );

    this.experience.scene.add(this.world);
    this.stateMachine.change(new IntroState()); // DURING DEVELOPENT
  }

  // private setLoadingScreen() {
  //   this.loadingModal = new LoadingModal();
  //   this.loadingModal.on("animationCompleted", () => {
  //     this.stateMachine.change(new IntroState());
  //   });
  // }

  public intro() {
    this.modal.intro();

    gsap.to(this.experience.camera.camera.position, {
      x: 4,
      y: 3,
      z: 10,
      duration: 1,
      onUpdate: () =>
        this.experience.camera.camera.lookAt(
          this.experience.camera.camera.position
        ),
    });
  }

  public setGameStart(): void {
    this.floorPositionY = this.floorSize * 1.5; // TODO ELEVATION

    gsap.to(this.experience.camera.camera.position, {
      x: 0.7,
      y: this.floorPositionY + this.floorSize,
      z: 5,
      duration: 1,
      onUpdate: () =>
        this.experience.camera.camera.lookAt(
          this.experience.camera.camera.position
        ),
      onComplete: () => this.addFloor(),
    });

    this.setGameOver = false;
    this.controllers.showPlayButtons();
    this.floorLevel.updatePositionY(-1);
  }

  public exploringWorld() {
    this.controllers.showPlayMenu();
    this.modal.closeModal();

    // DuringDevelopment

    // gsap.to(this.experience.camera.camera.position, {
    //   x: 8,
    //   y: 5,
    //   z: 2,
    //   duration: 1,
    //   onUpdate: () =>
    //     this.experience.camera.camera.lookAt(
    //       new Vector3(8, 0, 0)
    //       // this.experience.camera.camera.position
    //     ),
    // });
  }

  public gameEnded() {
    this.tower.remove(this.currentFloor!.mesh);

    if (!this.isGameOver) {
      this.controllers.hidePlayButtons();
      this.setGameOver = true;
    }

    this.character.model.position();

    this.modal.gameOver({ score: this.getScore });
  }

  public resetGame() {
    for (const object of this.addedObjects) {
      object.remove();
      this.physics.world.remove(object.body);
      this.tower.remove(object.mesh);
    }

    for (const object of this.tower.children) {
      this.tower.remove(object);
    }

    this.currentFloor = null;
    this.addedObjects.splice(0, this.getScore);
    this.floorLevel.updateText(0);
    this.floorLevel.isVisible(false);
    this.controllers.hidePlayButtons();
  }

  //// Tower game actions

  private addFloor() {
    if (this.currentFloor)
      this.floorPositionY = this.currentFloor.mesh.position.y;
    this.currentFloor = new TowerFloor({
      positionY: this.floorPositionY,
      floorSize: this.floorSize,
    });

    this.currentFloor.on("handleHasCollided", () => {
      this.addedObjects.push(this.currentFloor!);
      this.setScore = this.addedObjects.length;
      this.addFloor();
      this.updateFloorLevelText();
    });

    this.tower.add(this.currentFloor.mesh);
  }

  private updateFloorLevelText() {
    this.floorLevel.updateText(this.getScore);
    this.floorLevel.updatePositionY(-this.currentFloor!.mesh.position.y - 0.5);
    this.floorLevel.isVisible(this.getScore > 0);
  }

  private handleCollision(collidedBody: CANNON.Body) {
    if (!collidedBody || this.tower.children.length === 0) return;

    const objectInTower = this.tower.children.find((child) => {
      return child.userData.body === collidedBody;
    });

    if (!this.isGameOver && objectInTower) {
      this.stateMachine.change(new GameOverState());
    }
  }

  setupCollisionListeners() {
    this.ground.infiniteGroundBody.addEventListener("collide", (event: any) => {
      this.handleCollision(event.body);
    });
    // this.ground.groundBody.addEventListener("collide", (event: any) => {
    //   this.handleCollision(event.body);
    // });
  }

  // Others

  createModal() {
    this.modal = new Modal();

    this.modal.on("handleExploreWorld", () => {
      this.stateMachine.change(new ExploringState());
    });
  }

  public dropFloor() {
    this.currentFloor!.drop();
  }

  update() {
    // this.water.update();
    if (this.stateMachine.currentStateName === StatesNames.EXPLORING) {
      this.character.update();
    }
  }
}
