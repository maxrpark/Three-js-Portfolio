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

  public enter(): void {
    this.world.createWorld();

    gsap.to(this.experience.camera.camera.position, {
      y: 3,
      duration: 1,
    });
  }
  public update(): void {}
  public exit(): void {
    // console.log("end");
  }

  public start(): void {}
  public playing(): void {}
  public gameOver(): void {}
  public reset(): void {}
}
