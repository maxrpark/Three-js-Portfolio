import GameState from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import { StatesNames, StateMachine } from "../GameState";
import { StartGameState } from ".";

export default class ResetState extends GameState {
  private experience: Experience;
  private world: World;
  private stateMachine: StateMachine;
  constructor() {
    super(StatesNames.RESET_GAME);

    this.experience = new Experience();
    this.world = this.experience.world;
    this.stateMachine = this.experience.stateMachine;
  }
  public enter(): void {
    this.reset();
  }
  public update(): void {}
  public exit(): void {}

  public createWorld(): void {}
  public intro(): void {}
  public start(): void {}
  public playing(): void {}
  public paused(): void {}
  public gameOver(): void {}
  public reset(): void {
    this.world.towerStack.resetGame();
    this.stateMachine.change(new StartGameState());
  }
}
