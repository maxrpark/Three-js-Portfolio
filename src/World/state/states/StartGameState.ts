import GameState, { StatesNames } from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import { StateMachine } from "../GameState";
import PlayingState from "./PlayingState";
import TowerStack from "../../TowerStackGame";

export default class StartGameState extends GameState {
  private experience: Experience;
  private world: World;
  private stateMachine: StateMachine;
  private towerStack: TowerStack;

  constructor() {
    super(StatesNames.START_GAME);
    this.experience = new Experience();
    this.world = this.experience.world;
    this.towerStack = this.world.towerStack;
    this.stateMachine = this.world.stateMachine;
  }

  public enter(): void {
    this.start();
  }

  public exit(): void {}

  public createWorld(): void {}
  public intro(): void {}
  public start(): void {
    this.towerStack.setGameStart();
    this.stateMachine.change(new PlayingState());
  }
  public playing(): void {}
  public paused(): void {}
  public gameOver(): void {}
  public reset(): void {}
}
