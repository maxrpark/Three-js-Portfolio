export class StateMachine {
  private currentState: GameState;

  public change(state: GameState): void {
    if (this.currentState !== undefined) {
      this.currentState.exit();
    }

    this.currentState = state;
    this.currentState.enter();
  }

  public update(): void {
    if (this.currentState !== undefined) {
      // this.currentState.update();
    }
  }
}

export default class GameState {
  public enter(): void {}
  public update(): void {}
  public exit(): void {}
}

export class ResetState extends GameState {
  public enter(): void {}
  public update(): void {}
  public exit(): void {}

  public start(): void {}
  public playing(): void {}
  public gameOver(): void {}
  public reset(): void {}
}
