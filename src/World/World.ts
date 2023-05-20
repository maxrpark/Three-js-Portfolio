import { Group } from "three";
import { Experience } from "../experience/Experience";
import { Environment } from "./Environment";
import Debug from "../experience/utils/Debug";
import GUI from "lil-gui";
import { gsap } from "gsap";

import { TowerFloor, GroundArea, GroundFloor, Text2D } from "./objects";
import { PhysicsWorld } from "../experience/utils";
import { StateMachine } from "./state/GameState";
import { GameOverState, IntroState } from "./state/states";
import { Controllers, Modal, MenuIcon } from "./utils/";
import { StatesNames } from "./state/GameState";
import Water from "./shaders/water/Water";
import City from "./models/City";

export default class World {
  private experience: Experience;
  public environment: Environment;
  private physics: PhysicsWorld;
  public debug: Debug;
  public debugFolder: GUI;

  private world: Group;
  private tower: Group;
  private addedObjects: TowerFloor[];
  private groundFloor: GroundFloor;
  private ground: GroundArea;
  private floorLevel: Text2D;
  public water: Water;

  // model
  private city: City;

  public menuIcon: MenuIcon;
  public controllers: Controllers;
  public modal: Modal;
  public stateMachine: StateMachine;
  public currentFloor: TowerFloor | null;

  private floorY: number = 1;
  public isGameOver: boolean = false;
  public score: number = 0;

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
      anchorX: -1.5,
      fontSize: 1,
      visible: false,
    });

    this.tower = new Group();
    this.world = new Group();
    this.addedObjects = [];
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

    this.groundFloor = new GroundFloor();
    this.ground = new GroundArea();
    this.menuIcon = new MenuIcon();
    this.controllers = new Controllers();
    this.water = new Water();

    this.createModal();
    this.handleGroundCollision();

    this.world.add(
      this.tower,
      this.groundFloor.mesh,
      this.ground.mesh,
      this.water.mesh,
      // @ts-ignore
      this.floorLevel.instance,
      this.city.model
    );

    this.experience.scene.add(this.world);
    this.stateMachine.change(new IntroState());
  }

  public intro() {
    this.modal.intro();

    gsap.to(this.experience.camera.camera.position, {
      x: 2,
      y: 3,
      z: 8,
      duration: 1,
    });
  }

  public setGameStart(): void {
    this.floorPositionY = 0.5;
    this.addFloor();
    this.setGameOver = false;
    this.controllers.showPlayButtons();
    this.floorLevel.updatePositionY(-1);
  }

  private addFloor() {
    if (this.currentFloor)
      this.floorPositionY = this.currentFloor.mesh.position.y;
    this.currentFloor = new TowerFloor({ positionY: this.floorPositionY });

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

  private handleGroundCollision() {
    this.ground.groundBody.addEventListener("collide", (event: any) => {
      const collidedBody = event.body;

      if (!collidedBody || this.tower.children.length === 0) return;
      const objectInTower = this.tower.children.find((child) => {
        return child.userData.body === collidedBody;
      });

      if (!this.isGameOver && objectInTower) {
        this.stateMachine.change(new GameOverState());
      }
    });
  }

  createModal() {
    this.modal = new Modal();

    // TODO Create EXPLORE STATE IN THE FUTURE
    // To interact with world model and portfolio
    this.modal.on("handleExploreWorld", () => {
      this.controllers.showPlayMenu();
      this.modal.closeModal();
    });
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
    this.water.update();
  }
}
