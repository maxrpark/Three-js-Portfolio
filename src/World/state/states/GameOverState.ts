import GameState, { StateMachine, StatesNames } from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import Controllers from "../../utils/GameControllers";
import { Modal } from "../../utils";
import { ResetState } from "./";

export default class GameOverState extends GameState {
  experience: Experience;
  world: World;
  controllers: Controllers;
  modal: Modal;
  stateMachine: StateMachine;

  constructor() {
    super(StatesNames.GAME_OVER);

    this.experience = new Experience();
    this.world = this.experience.world;
    this.controllers = this.world.controllers;
    this.modal = this.world.modal;
    this.stateMachine = this.world.stateMachine;
  }

  // private keyEventListeners(event: KeyboardEvent) {
  //   switch (event.code) {
  //     case "Enter":
  //       this.world.resetGame();
  //     default:
  //       break;
  //   }
  // }

  // private keyEventListener = this.keyEventListeners.bind(this);

  public enter(): void {
    this.gameOver();
    // window.addEventListener("keydown", this.keyEventListener);
  }

  public exit(): void {
    // window.removeEventListener("keydown", this.keyEventListener);
  }

  public createWorld(): void {}
  public intro(): void {}
  public start(): void {}
  public playing(): void {}
  public paused(): void {}
  public gameOver(): void {
    this.modal.on("handleGameRestart", () =>
      this.stateMachine.change(new ResetState())
    );
    this.world.gameEnded();
  }
  public reset(): void {}
}
