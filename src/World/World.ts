import { Group } from "three";
import { Experience } from "../experience/Experience";
import { Environment } from "./Environment";
import Debug from "../experience/utils/Debug";
import GUI from "lil-gui";
import { gsap } from "gsap";

import { TowerFloor, Ground, GroundFloor, Text2D } from "./objects";
import { PhysicsWorld } from "../experience/utils";
import { StateMachine } from "./state/GameState";
import { GameOverState, IntroState, WorldCreationState } from "./state/states";
import { Controllers, Modal, MenuIcon } from "./utils/";
import { StatesNames } from "./state/GameState";
// import Water from "./shaders/water/Water";
import City from "./models/City";
import LoadingModal from "./utils/LoadingModal";
import Character from "./models/Character";
import ExploringState from "./state/states/Exploring";

export default class World {
  private experience: Experience;
  public environment: Environment;
  private physics: PhysicsWorld;
  public debug: Debug;
  public debugFolder: GUI;
  public stateMachine: StateMachine;

  // world elements
  private world: Group;
  private tower: Group;
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

    this.floorLevel = new Text2D({
      text: 0,
      anchorX: -3.5,
      fontSize: 1,
      visible: false,
    });

    this.tower = new Group();
    this.world = new Group();

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

  public createWorld() {
    if (this.stateMachine.currentStateName !== StatesNames.CREATION) return;

    this.city = new City();
    this.character = new Character();
    this.groundFloor = new GroundFloor({ floorSize: this.floorSize });
    this.ground = new Ground();
    this.menuIcon = new MenuIcon();
    this.controllers = new Controllers();
    // this.water = new Water();

    this.createModal();
    this.setupCollisionListeners();

    this.world.add(
      this.tower,
      this.groundFloor.mesh,
      // this.ground.mesh,
      // this.water.mesh,
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
      this.updateFloorLevelText();
      this.addFloor();
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

    if (!collidedBody || this.tower.children.length === 0) return;

    const objectInTower = this.tower.children.find((child) => {
      return child.userData.body === collidedBody;
    });

    if (!this.isGameOver && objectInTower) {
      this.stateMachine.change(new GameOverState());
    }
  }

  setupCollisionListeners() {
    // this.ground.infiniteGroundBody.addEventListener("collide", (event: any) => {
    //   this.handleCollision(event.body);
    // });
    // this.ground.groundBody.addEventListener("collide", (event: any) => {
    //   this.handleCollision(event.body);
    // });
  }

  createModal() {
    this.modal = new Modal();

    // TODO Create EXPLORE STATE IN THE FUTURE
    // To interact with world model and portfolio
    this.modal.on("handleExploreWorld", () => {
      this.stateMachine.change(new ExploringState());
    });
  }

  exploringWorld() {
    this.controllers.showPlayMenu();
    this.modal.closeModal();
  }

  public dropFloor() {
    this.currentFloor!.drop();
  }

  gameEnded() {
    this.tower.remove(this.currentFloor!.mesh);

    if (!this.isGameOver) {
      this.controllers.hidePlayButtons();
      this.setGameOver = true;
    }

    this.modal.gameOver({ score: this.getScore });
  }

  resetGame() {
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

  update() {
    // this.water.update();
    if (this.stateMachine.currentStateName === StatesNames.EXPLORING) {
      this.character.update();
    }
  }
}
