import { Mesh } from "three";
import { Time, Sizes, Camera, Renderer, Debug, PhysicsWorld } from "./utils";

import { Scene } from "three";
import World from "../World/World";
import Resources from "./utils/Resources";
import source from "../sources/base";
import { StateMachine } from "../World/state/GameState";
import {
  // IntroState,

  WorldCreationState,
} from "../World/state/states";
import LoadingModal from "../World/utils/LoadingModal";

declare global {
  interface Window {
    experience: Experience;
  }
}

export interface ExperienceInt {
  canvas?: HTMLCanvasElement | undefined;
  time: Time;
  sizes: Sizes;
  scene: Scene;
  camera: Camera;
  renderer: Renderer;
  world: World;
  debug: Debug;
  physics: PhysicsWorld;
  resources: Resources;
  stateMachine: StateMachine;
  update: () => void;
  resize: () => void;

  // loadingModal: LoadingModal;
}

let instance: Experience | null = null;

export class Experience implements ExperienceInt {
  canvas!: HTMLCanvasElement;
  time: Time;
  sizes: Sizes;
  scene: Scene;
  camera: Camera;
  renderer: Renderer;
  world: World;
  debug: Debug;
  physics: PhysicsWorld;
  resources: Resources;
  stateMachine: StateMachine;

  loadingModal: LoadingModal;
  constructor(canvas?: HTMLCanvasElement) {
    if (instance) {
      return instance;
    }

    instance = this;

    window.experience = this;
    this.canvas = canvas!;

    // setup
    this.debug = new Debug();
    this.time = new Time();
    this.time.on("tick", () => this.update());

    this.sizes = new Sizes();
    this.sizes.on("resize", () => this.resize());

    this.scene = new Scene();

    this.camera = new Camera();
    this.renderer = new Renderer();

    this.physics = new PhysicsWorld();

    this.resources = new Resources(source);

    // this.loadingModal = new LoadingModal();
    this.stateMachine = new StateMachine();

    // this.loadingModal.on("animationCompleted", () => {
    //   this.stateMachine.change(new IntroState());
    // });
    this.world = new World();

    this.resources.on("loaded", () => {
      this.world.loadingModal.progressModalOut();
      this.stateMachine.change(new WorldCreationState());
    });
  }
  update() {
    this.physics.update();
    // if (this.world) this.world.update();
    this.camera.update();

    this.renderer.update();
  }
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
  destroy() {
    this.sizes.off("resize");
    this.time.off("thick");

    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.renderer.dispose();

    if (this.debug.active) this.debug.ui.destroy();
  }
}
