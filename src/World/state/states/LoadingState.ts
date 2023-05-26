import GameState, { StateMachine, StatesNames } from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import Controllers from "../../utils/GameControllers";
import { MenuIcon, Modal } from "../../utils";
import { IntroState, ResetState } from ".";

export default class GameOverState extends GameState {
  experience: Experience;
  world: World;
  controllers: Controllers;
  modal: Modal;
  stateMachine: StateMachine;
  menuIcon: MenuIcon;

  constructor() {
    super(StatesNames.GAME_OVER);

    this.experience = new Experience();
    this.world = this.experience.world;
    this.controllers = this.world.controllers;
    this.modal = this.world.modal;
    this.menuIcon = this.world.menuIcon;
    this.stateMachine = this.world.stateMachine;
  }

  public enter(): void {
    this.gameOver();
  }

  public exit(): void {
    this.modal.off("handleGameRestart");
    this.modal.off("handleExit");
    this.menuIcon.off("handleMenuClick");
    this.controllers.off("controllerMenu");
  }

  public createWorld(): void {}
  public intro(): void {
    this.world.resetGame();
    this.stateMachine.change(new IntroState());
  }

  public start(): void {}
  public playing(): void {}
  public paused(): void {}
  public gameOver(): void {
    this.world.gameEnded();

    this.modal.on("handleExit", () => this.intro());
    this.modal.on("handleGameRestart", () => this.reset());

    this.menuIcon.on("handleMenuClick", () => this.closeModal());
    this.controllers.on("controllerMenu", () => this.closeModal());
  }
  public reset(): void {
    this.modal.closeModal();
    this.stateMachine.change(new ResetState());
  }

  closeModal() {
    this.modal.gameOver({ score: this.world.getScore });
  }
}
