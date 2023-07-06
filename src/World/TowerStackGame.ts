import { Group } from "three";
import { Experience } from "../experience/Experience";
import { PhysicsWorld } from "../experience/utils";
import { StateMachine } from "./state/GameState";
import { GroundFloor, Text2D, TowerFloor } from "./objects";
import { Controllers } from "./utils";
import World from "./World";
import { GameOverState } from "./state/states";
import { gsap } from "gsap";
import UserProgress from "./UserProgress";

export default class TowerStack {
  private experience: Experience;
  public world: World;
  private physics: PhysicsWorld;
  public stateMachine: StateMachine;
  public userProgress: UserProgress;

  //
  controllers: Controllers;

  // world elements
  private tower: Group = new Group();
  private floorLevel: Text2D;
  // public water: Water;

  private addedObjects: TowerFloor[] = [];

  groundFloor: GroundFloor;
  public currentFloor: TowerFloor | null;

  // Variables
  private floorY: number = 1;
  public isGameOver: boolean = false;
  public score: number = 0;
  private floorSize: number = 1;

  constructor() {
    this.experience = new Experience();
    this.stateMachine = this.experience.stateMachine;
    this.world = this.experience.world;
    this.physics = this.experience.physics;
    this.controllers = this.world.controllers;

    this.userProgress = this.experience.world.userProgress;

    this.setTowerStack();
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

  public setTowerStack() {
    this.groundFloor = new GroundFloor({ floorSize: this.floorSize });
    this.tower = new Group();
    this.floorLevel = new Text2D({
      text: 0,
      anchorX: -1.5,
      fontSize: 1,
      visible: false,
    });

    this.experience.scene.add(
      this.groundFloor.mesh,
      this.tower,
      //@ts-ignore
      this.floorLevel.instance
    );
  }

  public setGameStart(): void {
    this.userProgress.checkBadgesByID(2);
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

    this.setupCollisionListeners();
  }

  public gameEnded() {
    this.tower.remove(this.currentFloor!.mesh);

    console.log("hey");

    if (!this.isGameOver) {
      this.controllers.hidePlayButtons();
      this.setGameOver = true;
    }

    // this.character.model.position();

    this.world.modal.gameOver({ score: this.getScore });
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
    this.userProgress.checkTowerBadges(this.getScore);
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
    this.world.ground.infiniteGroundBody.addEventListener(
      "collide",
      (event: any) => {
        this.handleCollision(event.body);
      }
    );
  }

  // Others

  createModal() {
    // this.modal = new Modal();
    // this.modal.on("handleExploreWorld", () => {
    //   this.stateMachine.change(new ExploringState());
    // });
  }

  public dropFloor() {
    this.currentFloor!.drop();
  }
}
