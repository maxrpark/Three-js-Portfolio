import { PlaneGeometry, Mesh, ShaderMaterial, Vector2, Color } from "three";
import vertexShader from "./vertexShader.glsl";
import fragmentShader from "./fragmentShader.glsl";
import { Experience } from "../../../experience/Experience";
import { Debug, Time } from "../../../experience/utils";
import GUI from "lil-gui";

export default class Water {
  experience: Experience;
  time: Time;

  geometry: PlaneGeometry;
  material: ShaderMaterial;
  mesh: Mesh;
  debug: Debug;
  debugFolder: GUI;
  constructor() {
    this.experience = new Experience();

    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.createMesh();
    this.experience.scene.add(this.mesh);

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Waves");
      this.debugger();
    }
  }

  createGeometry() {
    this.geometry = new PlaneGeometry(0.7, 1.965, 512, 512);
  }
  createMaterial() {
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 10 },
        uBigWavesFrequency: { value: new Vector2(1.934, 2.698) },
        uBigWavesElevation: { value: 0.028 },
        uBigWavesSpeed: { value: 0.585 },

        uSmallWavesElevation: { value: 0.05 },
        uSmallWavesFrequency: { value: 3.357 },
        uSmallWavesSpeed: { value: 0.092 },
        uSmallIterations: { value: 2.112 },

        uColorOffset: { value: 0.009 },
        uColorMultiplier: { value: 2.134 },

        uDepthColor: { value: new Color("#045076") },
        uSurfaceColor: { value: new Color("#cccccc") },
      },
    });
  }
  createMesh() {
    this.createGeometry();
    this.createMaterial();

    this.mesh = new Mesh(this.geometry, this.material);

    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.position.y = 0.09;
    this.mesh.position.z = 8.04;
  }

  debugger() {
    this.debugFolder = this.debug.ui.addFolder("water");
    this.debugFolder
      .add(this.material.uniforms.uBigWavesFrequency.value, "x")
      .name("uFrequency x")
      .min(0)
      .max(20)
      .step(0.001);
    this.debugFolder
      .add(this.mesh.position, "y")
      .name("Position Y")
      .min(0)
      .max(1)
      .step(0.001);
    this.debugFolder
      .add(this.material.uniforms.uBigWavesFrequency.value, "y")
      .name("uFrequency y")
      .min(0)
      .max(20)
      .step(0.001);
    this.debugFolder
      .add(this.material.uniforms.uBigWavesElevation, "value")
      .name("uBigWavesElevation")
      .min(0)
      .max(2)
      .step(0.001);
    this.debugFolder
      .add(this.material.uniforms.uBigWavesSpeed, "value")
      .name("uBigWavesSpeed")
      .min(0)
      .max(10)
      .step(0.001);
    this.debugFolder
      .add(this.material.uniforms.uColorOffset, "value")
      .name("uColorOffset")
      .min(0)
      .max(2)
      .step(0.001);
    this.debugFolder
      .add(this.material.uniforms.uColorMultiplier, "value")
      .name("uColorMultiplier")
      .min(0)
      .max(10)
      .step(0.001);

    this.debugFolder
      .add(this.material.uniforms.uSmallWavesElevation, "value")
      .name("uSmallWavesElevation")
      .min(0)
      .max(0.3)
      .step(0.001);
    this.debugFolder
      .add(this.material.uniforms.uSmallWavesFrequency, "value")
      .name("uSmallWavesFrequency")
      .min(0)
      .max(5)
      .step(0.001);
    this.debugFolder
      .add(this.material.uniforms.uSmallWavesSpeed, "value")
      .name("uSmallWavesSpeed")
      .min(0)
      .max(0.5)
      .step(0.001);
    this.debugFolder
      .add(this.material.uniforms.uSmallIterations, "value")
      .name("uSmallIterations")
      .min(0)
      .max(5)
      .step(0.001);

    this.debugFolder
      .addColor(this.material.uniforms.uDepthColor, "value")
      .name("uDepthColor");
    this.debugFolder
      .addColor(this.material.uniforms.uSurfaceColor, "value")
      .name("uSurfaceColor");
  }

  update() {
    this.material.uniforms.uTime.value = this.time.current;
  }
}
