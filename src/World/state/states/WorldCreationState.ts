import GameState from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";

import { StatesNames } from "../GameState";

export default class WorldCreationState extends GameState {
  private experience: Experience;
  private world: World;
  constructor() {
    super(StatesNames.CREATION);

    this.experience = new Experience();
    this.world = this.experience.world;
  }

  public enter(): void {
    this.createWorld();
  }

  public update(): void {}
  public exit(): void {}

  public createWorld() {
    this.world.createWorld();
  }

  public intro(): void {}
  public start(): void {}
  public playing(): void {}
  public paused(): void {}
  public gameOver(): void {}
  public reset(): void {}
}
