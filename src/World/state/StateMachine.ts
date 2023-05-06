interface State {
  enter(): void;
  update(): void;
  exit(): void;
}

export class StateMachine {
  private currentState: State;

  public change(state: State): void {
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
