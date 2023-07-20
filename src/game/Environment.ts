import * as THREE from "three";
import { CSM } from "three/examples/jsm/csm/CSM";
import { CSMHelper } from "three/examples/jsm/csm/CSMHelper.js";
import { GroundProjectedEnv } from "three/examples/jsm/objects/GroundProjectedEnv.js";
import { Experience } from "../experience/Experience";
import { Debug } from "../experience/utils";
import GUI from "lil-gui";

interface IProps {
  environmentMapTexture?: any;
  hasAmbientLight?: boolean;
  hasHemisphereLight?: boolean;
  hasDirectionalLight?: boolean;
  castShadow?: boolean;
}

export class Environment {
  experience: Experience;
  ambientLight: THREE.AmbientLight;
  directionalLight: THREE.DirectionalLight;
  hemisphereLight: THREE.HemisphereLight;
  csmLight: CSM;
  scene: THREE.Scene;
  environmentMapTexture: any;
  environmentMap: any;
  debug: Debug;
  debugFolder: GUI;
  hasAmbientLight?: boolean;
  hasDirectionalLight?: boolean;
  csmHelper: any;

  castShadow: boolean = false;
  hasHemisphereLight: boolean;

  constructor(props?: IProps) {
    Object.assign(this, props);
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    if (this.hasAmbientLight) this.setAmbientLight();
    if (this.hasDirectionalLight) this.setDirectionalLight();
    if (this.hasHemisphereLight) this.setHemisphereLight();

    if (this.environmentMapTexture) {
      this.setEnvironmentMap();
    }
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight("#c2e8ff", 0.659);
    this.scene.add(this.ambientLight);

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("ambient light");
      this.debugFolder
        .add(this.ambientLight, "intensity")
        .name("intensity")
        .min(0)
        .max(4)
        .step(0.001);
      this.debugFolder
        .addColor(this.ambientLight, "color")
        .name("color")
        .min(0)
        .max(4)
        .step(0.001);
    }
  }

  setDirectionalLight() {
    this.directionalLight = new THREE.DirectionalLight("#FBFFCE", 0.8);

    this.directionalLight.position.set(4.733, 3.003, 3.13);
    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;

    this.directionalLight.shadow.camera.near = -100;
    this.directionalLight.shadow.camera.far = 30;

    this.directionalLight.castShadow = this.castShadow;

    this.directionalLight.shadow.camera.top = 10;
    this.directionalLight.shadow.camera.bottom = -10;
    this.directionalLight.shadow.camera.right = 20;
    this.directionalLight.shadow.camera.left = -20;
    this.directionalLight.shadow.normalBias = 0.5;

    const directionalLightCameraHelper = new THREE.CameraHelper(
      this.directionalLight.shadow.camera
    );

    // const directionalLightCameraHelper = new THREE.DirectionalLightHelper(
    //   this.directionalLight,
    //   5
    // );

    directionalLightCameraHelper.visible = false;

    this.scene.add(this.directionalLight);
    this.scene.add(directionalLightCameraHelper);

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("directional light");
      this.debugFolder
        .add(this.directionalLight, "intensity")
        .name("intensity")
        .min(0)
        .max(10)
        .step(0.001);
      this.debugFolder
        .add(this.directionalLight.position, "x")
        .name("x")
        .min(0)
        .max(20)
        .step(0.001);
      this.debugFolder
        .add(this.directionalLight.position, "y")
        .name("y")
        .min(0)
        .max(10)
        .step(0.001);
      this.debugFolder
        .add(this.directionalLight.position, "z")
        .name("z")
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.directionalLight.shadow, "normalBias")
        .min(-1)
        .max(1)
        .step(0.001);
      this.debugFolder
        .add(this.directionalLight.shadow, "bias")
        .min(-1)
        .max(1)
        .step(0.001);
      this.debugFolder
        .addColor(this.directionalLight, "color")
        .name("color")
        .min(0)
        .max(10)
        .step(0.001);
      this.debugFolder.add(directionalLightCameraHelper, "visible");
    }
  }

  setHemisphereLight() {
    this.hemisphereLight = new THREE.HemisphereLight("#f46315", "#00ff4c", 0.1);
    this.scene.add(this.hemisphereLight);

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Hemisphere Light");
      this.debugFolder
        .add(this.hemisphereLight, "intensity")
        .min(0)
        .max(4)
        .step(0.001);
      this.debugFolder
        .addColor(this.hemisphereLight, "color")
        .name("color")
        .min(0)
        .max(4)
        .step(0.001);
      this.debugFolder
        .addColor(this.hemisphereLight, "groundColor")
        .name("groundColor")
        .min(0)
        .max(4)
        .step(0.001);
    }
  }

  setCSMLights() {
    const params: any = {
      fade: false,
      far: 1000,
      mode: "practical",
      lightX: -1,
      lightY: -1,
      lightZ: -1,
      // lightX: 6.804,
      // lightY: 2.7,
      // lightZ: 2.3,
      margin: 100,
      lightFar: 5000,
      lightNear: 1,
      autoUpdateHelper: true,
      shadowBias: -0.003,
    };

    this.csmLight = new CSM({
      lightIntensity: 0.658,
      maxFar: params.far,
      cascades: 4,
      mode: params.mode,
      parent: this.scene,
      shadowMapSize: 1024,
      lightDirection: new THREE.Vector3(
        params.lightX,
        params.lightY,
        params.lightZ
      ).normalize(),
      camera: this.experience.camera.camera,
      shadowBias: params.shadowBias,
    });

    let material = new THREE.MeshPhongMaterial(); // works with Phong and Standard materials
    this.csmLight.setupMaterial(material);

    this.csmHelper = new CSMHelper(this.csmLight);
    this.csmHelper.visible = true;
    this.scene.add(this.csmHelper);

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("CSM light");

      this.debugFolder.add(params, "fade").onChange((value: any) => {
        this.csmLight.fade = value;
        this.csmLight.updateFrustums();
      });
      this.debugFolder
        .add(params, "far", 1, 5000)
        .step(1)
        .name("shadow far")
        .onChange((value: any) => {
          this.csmLight.maxFar = value;
          this.csmLight.updateFrustums();
        });

      this.debugFolder
        .add(params, "mode", ["uniform", "logarithmic", "practical"])
        .name("frustum split mode")
        .onChange((value: any) => {
          this.csmLight.mode = value;
          this.csmLight.updateFrustums();
        });

      this.debugFolder
        .add(params, "lightX", -1, 10)
        .name("light direction x")
        .onChange((value: any) => {
          this.csmLight.lightDirection.x = value;
        });

      this.debugFolder
        .add(params, "lightY", -1, 10)
        .name("light direction y")
        .onChange((value: any) => {
          this.csmLight.lightDirection.y = value;
        });

      this.debugFolder
        .add(params, "lightZ", -1, 10)
        .name("light direction z")
        .onChange((value: any) => {
          this.csmLight.lightDirection.z = value;
        });

      this.debugFolder
        .add(params, "margin", 0, 200)
        .name("light margin")
        .onChange((value: any) => {
          this.csmLight.lightMargin = value;
        });

      this.debugFolder
        .add(params, "lightNear", 1, 10000)
        .name("light near")
        .onChange((value: any) => {
          for (let i = 0; i < this.csmLight.lights.length; i++) {
            this.csmLight.lights[i].shadow.camera.near = value;
            this.csmLight.lights[i].shadow.camera.updateProjectionMatrix();
          }
        });

      this.debugFolder
        .add(params, "shadowBias", -0.000005, 0.05)
        .name("shadowBias")
        .onChange((value: any) => {
          this.csmLight.shadowBias = value;
        });

      this.debugFolder
        .add(params, "mode", ["uniform", "logarithmic", "practical"])
        .name("frustum split mode")
        .onChange((value: any) => {
          this.csmLight.mode = value;
          this.csmLight.updateFrustums();
        });
    }
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 3.117;

    const envMap = this.experience.resources.items
      .environmentMapTexture as THREE.Texture;
    envMap.mapping = THREE.EquirectangularReflectionMapping;

    this.environmentMap.texture = envMap;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;

    const skybox = new GroundProjectedEnv(envMap);
    this.scene.add(skybox);

    // this.scene.background = envMap;
    this.scene.environment = envMap;

    skybox.scale.setScalar(50);

    // Debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
      this.debugFolder
        .add(this.environmentMap, "intensity")
        .name("envMapIntensity")
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterial);

      this.debugFolder.add(skybox, "radius", 1, 200, 0.1).name("skyboxRadius");
      this.debugFolder.add(skybox, "height", 1, 100, 0.1).name("skyboxHeight");
    }
  }
  // update() {
  //   this.csmLight.update();
  //   this.csmHelper.update();
  // }
}
