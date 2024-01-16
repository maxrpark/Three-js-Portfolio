import * as THREE from "three";
import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";

interface Props {
  width: number;
  height: number;
  texture: THREE.Texture;
  url: string;
}

export class BasicPlane {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  geometry: THREE.PlaneGeometry;
  width: number;
  height: number;
  texture: THREE.Texture;
  url: string;

  constructor(props: Props) {
    Object.assign(this, props);

    this.createObject();
  }

  createObject() {
    // this.geometry = new THREE.BoxGeometry(this.width, this.height, 0.2, 32, 32);

    this.geometry = new THREE.PlaneGeometry(this.width, this.height, 32, 32);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSample: { value: this.texture },
        uVelocity: { value: 0 },
      },
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.userData = { url: this.url };
  }

  // update(time: number) {
  //   // this.mesh.rotation.y = this.material.uniforms.uVelocity.value * 0.1;
  // }
}
