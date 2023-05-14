import GameState from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import { StatesNames, StateMachine } from "../GameState";
// import MenuIcon from "../../utils/MenuIcon";
import Modal from "../../utils/Modal";
import PlayingState from "./PlayingState";
import IntroState from "./IntroState";

export default class PausedState extends GameState {
  private experience: Experience;
  private world: World;
  private modal: Modal;
  private stateMachine: StateMachine;
  constructor() {
    super(StatesNames.PAUSED);

    this.experience = new Experience();
    this.world = this.experience.world;
    this.modal = this.world.modal;
    this.stateMachine = this.world.stateMachine;
  }
  public enter(): void {
    this.paused();
  }
  public update(): void {}
  public exit(): void {
    this.modal.off("handleContinue");
    this.modal.off("handleExit");
  }

  public createWorld(): void {}
  public intro(): void {
    this.world.resetGame();
    this.stateMachine.change(new IntroState());
  }
  public start(): void {}
  public playing(): void {
    this.modal.closeModal();
    this.stateMachine.change(new PlayingState());
  }

  public paused(): void {
    this.modal.pauseMode();
    this.modal.on("handleContinue", () => this.playing());
    this.modal.on("handleExit", () => this.intro());
  }
  public gameOver(): void {}
  public reset(): void {}
}
