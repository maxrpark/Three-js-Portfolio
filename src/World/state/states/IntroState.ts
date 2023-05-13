import GameState, { StateMachine, StatesNames } from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import { Modal } from "../../utils";
import PlayingState from "./PlayingState";
// import { gsap } from "gsap";

export default class IntroState extends GameState {
  private experience: Experience;
  private world: World;
  private modal: Modal;
  private stateMachine: StateMachine;
  constructor() {
    super(StatesNames.INTRO);

    this.experience = new Experience();
    this.world = this.experience.world;
    this.modal = this.world.modal;
    this.stateMachine = this.world.stateMachine;
  }

  // private keyEventListeners(event: KeyboardEvent) {
  //   switch (event.code) {
  //     case "Enter":
  //       this.world.startNewGame();
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // private keyEventListener = this.keyEventListeners.bind(this);

  public enter(): void {
    this.intro();
  }

  public update(): void {}
  public exit(): void {
    // window.removeEventListener("keydown", this.keyEventListener);
    this.modal.off("handleGameStartClick");
  }

  public createWorld(): void {
    window.alert("World Already created");
  }
  public intro(): void {
    this.world.intro();

    this.modal.on("handleGameStartClick", () => {
      this.stateMachine.change(new PlayingState());
    });
  }

  public start(): void {}
  public playing(): void {}
  public paused(): void {}
  public gameOver(): void {}
  public reset(): void {}
}
