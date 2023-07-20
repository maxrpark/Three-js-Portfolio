import { Experience, ExperienceInt } from "./Experience";
import { Sizes, Camera, Debug } from "./utils";
import Stats from "three/examples/jsm/libs/stats.module";
import {
  WebGLRenderer,
  Scene,
  sRGBEncoding,
  PCFSoftShadowMap,
  LinearToneMapping,
  NoToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  ACESFilmicToneMapping,
} from "three";
import GUI from "lil-gui";

export interface RendererInt {
  renderer: WebGLRenderer;
  experience: ExperienceInt;
  scene: Scene;
  canvas: HTMLCanvasElement;
  camera: Camera;
}

export class Renderer implements RendererInt {
  renderer: WebGLRenderer;
  experience: ExperienceInt;
  scene: Scene;
  sizes: Sizes;
  canvas: HTMLCanvasElement;
  camera: Camera;
  stats: any;

  debug: Debug;
  debugFolder: GUI;

  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.canvas = this.experience.canvas!;
    this.camera = this.experience.camera;

    if (window.location.hash === "#debug") {
      this.stats = Stats();
      document.body.appendChild(this.stats.dom);
    }

    this.setRenderer();
  }
  setRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setClearColor("#557edd");
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));

    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.toneMapping = LinearToneMapping;
    this.renderer.toneMappingExposure = 0.6;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
      this.debugFolder
        .add(this.renderer, "toneMappingExposure")
        .name("toneMappingExposure")
        .min(0)
        .max(4)
        .step(0.001);
      this.debugFolder.add(this.renderer, "toneMapping", {
        No: NoToneMapping,
        Linear: LinearToneMapping,
        Reinhard: ReinhardToneMapping,
        Cineon: CineonToneMapping,
        ACESFilmic: ACESFilmicToneMapping,
      });
      // .onChange(this.environmentMap.updateMaterial);
    }
  }

  update() {
    if (window.location.hash === "#debug") this.stats.update();
    this.renderer.render(this.scene, this.camera.camera);
  }
  resize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }
}
