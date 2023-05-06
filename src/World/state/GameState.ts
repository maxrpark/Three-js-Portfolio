// import World from "../World";
// import { Experience } from "../../experience/Experience";
// import { IntroState } from "./states";

interface State {
  enter(): void;
  update(): void;
  exit(): void;
}

// export enum GameStateType {
//   Intro,
//   Start,
//   Playing,
//   GameOver,
//   // add more states here...
// }

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

export default class GameState implements State {
  public enter(): void {}
  public update(): void {}
  public exit(): void {}

  intro() {}
  start() {}
  playing() {}
  // pause() {}
  gameOver() {}
  reset() {}
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

// export const stateClasses: Record<GameStateType, typeof GameState> = {
//   [GameStateType.Intro]: IntroState,
//   [GameStateType.Start]: StartState,
//   [GameStateType.Playing]: PlayingState,
//   [GameStateType.GameOver]: GameOverState,
//   // add more state classes here...
// };
