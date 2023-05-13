export class StateMachine {
  private currentState: GameState;
  public currentStateName: string;

  public change(state: GameState): void {
    if (this.currentState !== undefined) {
      this.currentState.exit();
    }

    this.currentState = state;
    this.currentStateName = state.stateName;
    this.currentState.enter();
  }

  public update(): void {
    if (this.currentState !== undefined) {
      // this.currentState.update();
    }
  }
}

export enum StatesNames {
  CREATION = "creation",
  INTRO = "intro",
  START_GAME = "start",
  PLAYING = "playing",
  GAME_OVER = "gameOver",
  RESTART_GAME = "restart",
}

export default class GameState {
  public stateName: string;
  public enter(): void {}
  public update(): void {}
  public exit(): void {}
  constructor(stateName: StatesNames) {
    this.stateName = stateName;
  }
}
