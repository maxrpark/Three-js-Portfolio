import { Experience } from "../experience/Experience";
import { Environment } from "./Environment";
import { Debug, PhysicsWorld } from "../experience/utils";

import GUI from "lil-gui";
import { gsap } from "gsap";

import { Ground } from "./objects";

import { StateMachine, StatesNames } from "./state/GameState";
import { IntroState, WorldCreationState, ExploringState } from "./state/states";
import { Controllers, Modal, MenuIcon, LoadingModal } from "./utils";

import { City } from "./models";
import ExploringWorld from "./ExploringWorld";
import TowerStack from "./TowerStackGame";
import UserProgress from "./UserProgress";
import ToastNotification from "./utils/ToastNotification";
import ModalProgress from "./utils/ModalProgress";

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
  modalProgress: ModalProgress;

  // Controls and Icons
  public menuIcon: MenuIcon;

  constructor() {
    this.experience = new Experience();
    this.stateMachine = this.experience.stateMachine;
    this.controllers = new Controllers();

    this.setLoadingScreen();

    this.experience.resources.on("loaded", () => {
      this.loadingModal.progressModalOut(); // COMMENTED DURING DEVELOPENT
      this.stateMachine.change(new WorldCreationState());
    });
  }

  public createWorld() {
    if (this.stateMachine.currentStateName !== StatesNames.CREATION) return;

    this.toastNotification = new ToastNotification();
    this.city = new City();
    this.userProgress = new UserProgress();
    this.towerStack = new TowerStack();
    this.ground = new Ground();
    this.menuIcon = new MenuIcon();
    this.exploringWorld = new ExploringWorld();
    this.modalProgress = new ModalProgress();

    this.environment = new Environment({
      // hasAmbientLight: true,
      // hasDirectionalLight: true,
      // castShadow: true,
      environmentMapTexture:
        this.experience.resources.items.environmentMapTexture,
    });

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
      y: 6,
      z: 17,
      duration: 1,
      onUpdate: () => this.experience.camera.camera.lookAt(1, 0, 0),
    });
  }

  public setExploringWorld() {
    this.controllers.showPlayMenu();
    this.modal.closeModal();
    this.userProgress.checkBadgesByID(1);
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
