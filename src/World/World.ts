import { Experience } from "../experience/Experience";
import { Environment } from "./Environment";
import { Debug, PhysicsWorld } from "../experience/utils";

import GUI from "lil-gui";
import { gsap } from "gsap";

import { Ground } from "./objects";

import { StateMachine, StatesNames } from "./state/GameState";
import { IntroState, WorldCreationState, ExploringState } from "./state/states";
import { Controllers, Modal, MenuIcon, LoadingModal } from "./utils/";

import { City } from "./models";
import ExploringWorld from "./ExploringWorld";
import TowerStack from "./TowerStackGame";
import UserProgress from "./UserProgress";
import ToastNotification from "./utils/ToastNotification";

export default class World {
  private experience: Experience;
  public environment: Environment;
  public stateMachine: StateMachine;
  physics: PhysicsWorld;
  controllers: Controllers;

  //
  public debug: Debug;
  public debugFolder: GUI;

  // world elements
  ground: Ground;

  // Intro Screen and Modal
  public loadingModal: LoadingModal;
  public modal: Modal;

  // 3D Model
  city: City;

  // Main States

  exploringWorld: ExploringWorld;
  towerStack: TowerStack;
  userProgress: UserProgress;

  // ToastNotification
  toastNotification: ToastNotification;

  // Controls and Icons
  public menuIcon: MenuIcon;

  // Variables
  public score: number = 0;

  constructor() {
    this.experience = new Experience();
    this.stateMachine = this.experience.stateMachine;
    this.controllers = new Controllers();
    this.environment = new Environment({
      hasAmbientLight: true,
      hasDirectionalLight: true,
      castShadow: true,
    });

    this.setLoadingScreen();

    this.experience.resources.on("loaded", () => {
      this.loadingModal.progressModalOut(); // COMMENTED DURING DEVELOPENT
      this.stateMachine.change(new WorldCreationState());
    });
  }

  public get getScore(): number {
    return this.score;
  }

  public createWorld() {
    if (this.stateMachine.currentStateName !== StatesNames.CREATION) return;

    this.toastNotification = new ToastNotification();
    this.city = new City();
    this.towerStack = new TowerStack();
    this.ground = new Ground();
    this.menuIcon = new MenuIcon();
    this.userProgress = new UserProgress();
    this.exploringWorld = new ExploringWorld();

    this.createModal();

    // this.stateMachine.change(new IntroState()); // DURING DEVELOPENT
  }

  private setLoadingScreen() {
    this.loadingModal = new LoadingModal();
    this.loadingModal.on("animationCompleted", () => {
      this.stateMachine.change(new IntroState());
    });
  }

  public intro() {
    this.modal.intro();

    gsap.to(this.experience.camera.camera.position, {
      x: 4,
      y: 3,
      z: 10,
      duration: 1,
      onUpdate: () =>
        this.experience.camera.camera.lookAt(
          this.experience.camera.camera.position
        ),
    });
  }

  public setExploringWorld() {
    this.controllers.showPlayMenu();
    this.modal.closeModal();
  }

  createModal() {
    this.modal = new Modal();
    this.modal.on("handleExploreWorld", () => {
      this.stateMachine.change(new ExploringState());
    });
  }

  update() {
    if (this.stateMachine.currentStateName === StatesNames.EXPLORING) {
      this.exploringWorld.update();
    }
  }
}
