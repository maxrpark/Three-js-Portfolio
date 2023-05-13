import GameState from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import { gsap } from "gsap";
import { StatesNames } from "../GameState";

export default class WorldCreationState extends GameState {
  private experience: Experience;
  private world: World;
  constructor() {
    super(StatesNames.CREATION);

    this.experience = new Experience();
    this.world = this.experience.world;
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
    this.createWorld();

    // window.addEventListener("keydown", this.keyEventListener);
  }

  public update(): void {}
  public exit(): void {
    // window.removeEventListener("keydown", this.keyEventListener);
  }

  public createWorld() {
    this.world.createWorld();

    gsap.to(this.experience.camera.camera.position, {
      y: 3,
      duration: 1,
    });
  }

  public intro(): void {}
  public start(): void {}
  public playing(): void {}
  public paused(): void {}
  public gameOver(): void {}
  public reset(): void {}
}
