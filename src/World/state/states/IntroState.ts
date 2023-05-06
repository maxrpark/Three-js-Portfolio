import GameState from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import { gsap } from "gsap";

export default class IntroState extends GameState {
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
        this.world.startNewGame();
        break;
      default:
        break;
    }
  }

  private keyEventListener = this.keyEventListeners.bind(this);

  public enter(): void {
    this.world.createWorld();

    gsap.to(this.experience.camera.camera.position, {
      y: 3,
      duration: 1,
    });

    window.addEventListener("keydown", this.keyEventListener);
  }

  public update(): void {}
  public exit(): void {
    window.removeEventListener("keydown", this.keyEventListener);
  }
}
