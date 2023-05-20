import { Experience, ExperienceInt } from "./Experience";
import { Sizes, Camera } from "./utils";
import Stats from "three/examples/jsm/libs/stats.module";
import {
  WebGLRenderer,
  Scene,
  sRGBEncoding,
  PCFSoftShadowMap,
  LinearToneMapping,
  // sRGBEncoding,
  // CineonToneMapping,
  // PCFSoftShadowMap,
} from "three";

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

  constructor() {
    this.experience = new Experience();
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
    this.renderer.shadowMap.enabled = true;
    // this.renderer.physicallyCorrectLights = true;

    // this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.toneMapping = LinearToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
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
