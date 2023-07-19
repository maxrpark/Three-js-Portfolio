import GameState, { StateMachine } from "../GameState";

import { StatesNames } from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import { Controllers, MenuIcon } from "../../utils";
import IntroState from "./IntroState";
import GameOverState from "./GameOverState";

export default class ExploringState extends GameState {
  experience: Experience;
  world: World;
  private stateMachine: StateMachine;
  private menuIcon: MenuIcon;
  private controllers: Controllers;
  states: {};
  private previousState: IntroState | GameOverState;
  constructor() {
    super(StatesNames.EXPLORING);
    this.experience = new Experience();
    this.world = this.experience.world;
    this.menuIcon = this.world.menuIcon;
    this.stateMachine = this.world.stateMachine;
    this.controllers = this.world.controllers;

    this.states = {
      [StatesNames.INTRO]: IntroState,
      [StatesNames.GAME_OVER]: GameOverState,
    };
  }
  public enter(): void {
    this.world.setExploringWorld();
    //@ts-ignore
    this.previousState = this.states[this.stateMachine.previousStateName];
    this.experience.camera.camera.fov = 45;
    this.experience.camera.camera.updateProjectionMatrix();

    this.menuIcon.on("handleMenuClick", () => {
      this.exit();
    });
    this.controllers.on("controllerMenu", () => {
      this.exit();
    });

    document.body.classList.add("exploring");
    document.body
      .querySelector(".mobile-character-controller")
      ?.classList.add("visible");
  }

  public exit(): void {
    this.menuIcon.off("handleMenuClick");
    this.controllers.off("controllerMenu");
    this.experience.world.exploringWorld.timeLine.reverse();

    setTimeout(() => {
      document.body.classList.remove("exploring");
    }, 500);
    document.body
      .querySelector(".mobile-character-controller")
      ?.classList.remove("visible");

    setTimeout(() => {
      //@ts-ignore
      this.stateMachine.change(new this.previousState());
    });

    this.experience.camera.camera.fov = 75;
    this.experience.camera.camera.updateProjectionMatrix();

    //
  }

  public exploring(): void {}
}
