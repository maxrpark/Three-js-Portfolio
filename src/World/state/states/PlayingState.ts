import GameState from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import { StateMachine } from "../GameState";
import GameOverState from "./GameOverState";
import { Object3D } from "three";

export default class PlayingState extends GameState {
  experience: Experience;
  world: World;
  stateMachine: StateMachine;

  constructor() {
    super();

    this.experience = new Experience();

    this.world = this.experience.world;
    this.stateMachine = this.experience.stateMachine;
  }

  private keyEventListeners(event: KeyboardEvent) {
    switch (event.code) {
      case "Space":
        this.world.currentFloor.drop();
        break;
      default:
        break;
    }
  }

  private keyEventListener = this.keyEventListeners.bind(this);

  public enter(): void {
    this.world.setFloorY(1);
    this.world.addFloor();
    this.world.updateFloorLevelText();

    this.world.handleGroundCollision((objectInTower: Object3D | undefined) => {
      if (objectInTower) {
        this.gameOver();
      }
    });

    window.addEventListener("keydown", this.keyEventListener);
  }

  public gameOver(): void {
    this.stateMachine.change(new GameOverState());
  }
  public exit(): void {
    window.removeEventListener("keydown", this.keyEventListener);
  }
  public reset(): void {}
}
