import GameState, { StateMachine, StatesNames } from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import { Modal, MenuIcon, Controllers } from "../../utils";
import { StartGameState } from "./";

export default class IntroState extends GameState {
  private experience: Experience;
  private world: World;
  private modal: Modal;
  private stateMachine: StateMachine;
  private menuIcon: MenuIcon;
  private controllers: Controllers;
  constructor() {
    super(StatesNames.INTRO);

    this.experience = new Experience();
    this.world = this.experience.world;
    this.modal = this.world.modal;
    this.menuIcon = this.world.menuIcon;
    this.stateMachine = this.world.stateMachine;
    this.modal = this.world.modal;
    this.controllers = this.world.controllers;
  }

  public enter(): void {
    this.intro();
  }

  public update(): void {}
  public exit(): void {
    this.modal.off("handleGameStartClick");
    this.modal.off("handleMenuClick");
    this.modal.closeModal();
  }

  public createWorld(): void {
    window.alert("World Already created");
  }
  public intro(): void {
    this.world.intro();

    this.modal.on("handleGameStartClick", () => {
      this.stateMachine.change(new StartGameState());
    });

    this.menuIcon.on("handleMenuClick", () => this.modal.intro());
    this.controllers.on("controllerMenu", () => this.modal.intro());
  }

  public start(): void {}
  public playing(): void {}
  public paused(): void {}
  public gameOver(): void {}
  public reset(): void {}
}
