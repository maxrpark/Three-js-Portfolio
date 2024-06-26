import GameState, { StatesNames } from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import { StateMachine } from "../GameState";
import MenuIcon from "../../utils/MenuIcon";
import { PausedState } from ".";
import { Controllers } from "../../utils";

export default class PlayingState extends GameState {
  private experience: Experience;
  private world: World;
  private menuIcon: MenuIcon;
  private stateMachine: StateMachine;
  private controllers: Controllers;

  constructor() {
    super(StatesNames.PLAYING);
    this.experience = new Experience();
    this.world = this.experience.world;
    this.menuIcon = this.world.menuIcon;
    this.controllers = this.world.controllers;
    this.stateMachine = this.world.stateMachine;
  }

  private keyEventListeners(event: KeyboardEvent) {
    switch (event.code) {
      case "Space":
        this.world.towerStack.currentFloor!.drop();
        break;
      default:
        break;
    }
  }

  private keyEventListener = this.keyEventListeners.bind(this);

  public enter(): void {
    this.playing();
  }

  public exit(): void {
    window.removeEventListener("keydown", this.keyEventListener);
    this.menuIcon.off("handleMenuClick");
    this.controllers.off("controllerDrop");
    this.controllers.off("controllerMenu");
    this.world.towerStack.timeLine.reverse();
  }

  public createWorld(): void {}
  public intro(): void {}
  public start(): void {}
  public playing(): void {
    window.addEventListener("keydown", this.keyEventListener);

    this.controllers.on("controllerDrop", () => {
      this.world.towerStack.dropFloor();
    });

    this.menuIcon.on("handleMenuClick", () => this.paused());
    this.controllers.on("controllerMenu", () => this.paused());
  }
  public paused(): void {
    this.stateMachine.change(new PausedState());
  }
  public gameOver(): void {}
  public reset(): void {}
}
