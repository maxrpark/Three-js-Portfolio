import GameState from "../GameState";

import { StatesNames } from "../GameState";

export default class ExploringState extends GameState {
  constructor() {
    super(StatesNames.EXPLORING);
  }
  public enter(): void {
    // this.reset();
  }
  public update(): void {}
  public exit(): void {}

  public exploring(): void {}
}
