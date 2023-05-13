import { Group } from "three";
import { Experience } from "../experience/Experience";
import { Environment } from "./Environment";
import Debug from "../experience/utils/Debug";
import GUI from "lil-gui";

import { TowerFloor, GroundArea, GroundFloor, Text2D } from "./objects";
import { PhysicsWorld } from "../experience/utils";
import { StateMachine } from "./state/GameState";
import {
  GameOverState,
  IntroState,
  PausedState,
  PlayingState,
} from "./state/states";
import { Controllers, Modal, MenuIcon } from "./utils/";
import { StatesNames } from "./state/GameState";

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

  public menuIcon: MenuIcon;
  public controllers: Controllers;
  public modal: Modal;
  public stateMachine: StateMachine;
  public currentFloor: TowerFloor | null;

  private floorY: number = 1;
  private isGameOver: boolean = false;

  constructor() {
    this.experience = new Experience();
    this.stateMachine = this.experience.stateMachine;
    this.physics = this.experience.physics;
    this.environment = new Environment({
      hasAmbientLight: true,
      hasDirectionalLight: true,
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

  private get setGameOver(): boolean {
    return this.isGameOver;
  }

  public createWorld() {
    if (this.stateMachine.currentStateName !== StatesNames.CREATION) return;

    this.groundFloor = new GroundFloor();
    this.ground = new GroundArea();
    this.createModal();
    this.createMenuIcon();
    this.gameControllers();
    this.handleGroundCollision();

    this.world.add(
      this.tower,
      this.groundFloor.mesh,
      this.ground.mesh,
      // @ts-ignore
      this.floorLevel.instance
    );
    this.experience.scene.add(this.world);
    this.stateMachine.change(new IntroState());
  }

  public intro() {
    this.modal.intro();
  }

  public setGameStart(): void {
    this.modal.display("none");
    this.menuIcon.classAdd("hide-icon");
    this.floorLevel.isVisible(false);

    this.floorPositionY = 1;

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
      this.updateFloorLevelText();
      this.addFloor();
    });

    this.tower.add(this.currentFloor.mesh);
  }

  private updateFloorLevelText() {
    this.floorLevel.updateText(this.addedObjects.length);
    this.floorLevel.updatePositionY(-this.currentFloor!.mesh.position.y - 0.5);
    this.floorLevel.isVisible(this.addedObjects.length > 0);
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

    this.modal.on("handleContinue", () => {
      this.menuIcon.classRemove("hide-icon");
      this.modal.display("none");
    });

    this.modal.on("handleExit", () => {
      this.menuIcon.classRemove("hide-icon");
      this.resetGame();
      this.stateMachine.change(new IntroState());
    });
  }

  createMenuIcon() {
    this.menuIcon = new MenuIcon();
    this.menuIcon.classAdd("hide-icon");

    this.menuIcon.on("handleMenuClick", () => {
      this.stateMachine.change(new PausedState());
      // this.modal.display("flex");
      // this.menuIcon.classRemove("hide-icon");
    });
  }

  private gameControllers() {
    this.controllers = new Controllers();

    this.controllers.on("controllerDrop", () => {
      if (this.isGameOver) return;
      this.currentFloor!.drop();
    });
    this.controllers.on("controllerPause", () => {
      if (this.isGameOver) return;
    });
  }

  gameEnded() {
    this.tower.remove(this.currentFloor!.mesh);

    if (!this.isGameOver) {
      this.controllers.hidePlayButtons();
      this.setGameOver = true;
    }

    this.modal.gameOver({ score: this.addedObjects.length });
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
    this.addedObjects.splice(0, this.addedObjects.length);
    this.floorLevel.updateText(0);

    // this.stateMachine.change(new PlayingState());
  }

  update() {}
}
