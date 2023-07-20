import GUI from "lil-gui";
import { Experience, ExperienceInt } from "./Experience";
import { Debug, Sizes } from "./utils";
import { PerspectiveCamera, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Camera {
  experience: ExperienceInt;
  camera: PerspectiveCamera;
  scene: Scene;
  sizes: Sizes;
  controls: OrbitControls;
  canvas: HTMLCanvasElement;
  debug: Debug;
  debugFolder: GUI;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.canvas = this.experience.canvas!;

    this.debug = this.experience.debug;
    if (this.debug.active) this.debugFolder = this.debug.ui.addFolder("towers");
    this.setCamera();
  }

  setCamera() {
    this.camera = new PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.camera.position.set(2, 20, 8);

    this.scene.add(this.camera);
    // this.setControls();
  }
  setControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }
  resize() {
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
  }
  update() {
    // this.controls.update();
  }
}
