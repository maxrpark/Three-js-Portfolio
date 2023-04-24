import { Experience, ExperienceInt } from "./Experience";
import { Sizes, Camera } from "./utils";
import {
  WebGLRenderer,
  Scene,
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

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.canvas = this.experience.canvas!;
    this.camera = this.experience.camera;

    this.setRenderer();
  }
  setRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setClearColor("#211d20");
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    // this.renderer.physicallyCorrectLights = true;

    // this.renderer.physicallyCorrectLights = true;
    // this.renderer.outputEncoding = sRGBEncoding;
    // this.renderer.toneMapping = CineonToneMapping;
    // this.renderer.toneMappingExposure = 1;
    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = PCFSoftShadowMap;
  }

  update() {
    this.renderer.render(this.scene, this.camera.camera);
  }
  resize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }
}
