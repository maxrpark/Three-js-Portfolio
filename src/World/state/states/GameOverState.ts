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

  public enter(): void {
    this.world.gameEnded();
  }
  public update(): void {}
  public exit(): void {}

  public start(): void {}
  public playing(): void {}
  public gameOver(): void {}
  public reset(): void {}
}
