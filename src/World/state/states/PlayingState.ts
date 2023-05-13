import GameState, { StatesNames } from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";

export default class PlayingState extends GameState {
  private experience: Experience;
  private world: World;

  constructor() {
    super(StatesNames.PLAYING);
    this.experience = new Experience();
    this.world = this.experience.world;
  }

  private keyEventListeners(event: KeyboardEvent) {
    switch (event.code) {
      case "Space":
        this.world.currentFloor!.drop();
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
  }

  public createWorld(): void {}
  public intro(): void {}
  public start(): void {}
  public playing(): void {
    this.world.setGameStart();
    window.addEventListener("keydown", this.keyEventListener);
  }
  public paused(): void {}
  public gameOver(): void {}
  public reset(): void {}
}
