import GameState from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import { StatesNames } from "../GameState";
import MenuIcon from "../../utils/MenuIcon";
import Modal from "../../utils/Modal";

export default class PausedState extends GameState {
  private experience: Experience;
  private world: World;
  private modal: Modal;
  private menuIcon: MenuIcon;
  constructor() {
    super(StatesNames.RESTART_GAME);

    this.experience = new Experience();
    this.world = this.experience.world;
    this.modal = this.world.modal;
    this.menuIcon = this.world.menuIcon;
  }
  public enter(): void {
    this.paused();
  }
  public update(): void {}
  public exit(): void {}

  public createWorld(): void {}
  public intro(): void {}
  public start(): void {}
  public playing(): void {}
  public paused(): void {
    // this.modal.display("flex");
    this.modal.pauseMode();
    this.menuIcon.classRemove("hide-icon");
    // this.menuIcon.on("handleMenuClick", () => {
    //   this.modal.display("flex");
    //   this.menuIcon.classRemove("hide-icon");
    // });
  }
  public gameOver(): void {}
  public reset(): void {}
}
