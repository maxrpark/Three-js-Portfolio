export class StateMachine {
  private currentState: GameState;
  public currentStateName: string;

  public change(state: GameState): void {
    if (this.currentState?.stateName === state.stateName) return;

    if (this.currentState !== undefined) {
      this.currentState.exit();
    }

    this.currentState = state;
    this.currentStateName = state.stateName;
    console.log(`STATE NAME: ${state.stateName}`);
    this.currentState.enter();
  }

  public update(): void {
    if (this.currentState !== undefined) {
      // this.currentState.update();
    }
  }
}

export enum StatesNames {
  LOADING = "loading",
  CREATION = "creation",
  INTRO = "intro",
  EXPLORING = "exploring",
  START_GAME = "start",
  PLAYING = "playing",
  PAUSED = "paused",
  GAME_OVER = "gameOver",
  RESET_GAME = "reset",
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
