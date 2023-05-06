import GameState from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";

export default class GameOverState extends GameState {
  experience: Experience;
  world: World;

  constructor() {
    super();

    this.experience = new Experience();
    this.world = this.experience.world;
  }

  private keyEventListeners(event: KeyboardEvent) {
    switch (event.code) {
      case "Enter":
        this.world.resetGame();
      default:
        break;
    }
  }

  private keyEventListener = this.keyEventListeners.bind(this);

  public enter(): void {
    this.world.gameEnded();

    window.addEventListener("keydown", this.keyEventListener);
  }

  public exit(): void {
    window.removeEventListener("keydown", this.keyEventListener);
  }
}
