import * as THREE from "three";
import { ResourceItemsInt } from "../experience/utils/Resources";

interface IProps {
  textures: ResourceItemsInt;
}

export interface BlockInt {
  geometry: THREE.BoxGeometry;
  material: THREE.Material;
  mesh: THREE.Mesh;
  setGeometry: () => void;
  setMaterial: () => void;
  createMesh: () => void;

  texture: {
    normal: any;
    color: any;
  }; // TODO
}

export class StandardBlock implements BlockInt {
  geometry: THREE.BoxGeometry;
  material: THREE.Material;
  mesh: THREE.Mesh;
  texture: {
    normal: any;
    color: any;
  }; // TODO
  textures: ResourceItemsInt;

  constructor(props?: IProps) {
    Object.assign(this, props);
    this.createMesh();
  }
  setGeometry() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
  }

  setTextures() {
    this.texture = {
      normal: undefined,
      color: undefined,
    };

    this.texture.color = this.textures.color;
    this.texture.color.encoding = THREE.sRGBEncoding;
    this.texture.color.repeat.set(1.5, 1.5);
    this.texture.color.wrapS = THREE.RepeatWrapping;
    this.texture.color.wrapT = THREE.RepeatWrapping;

    this.texture.normal = this.textures.normal;
    this.texture.normal.repeat.set(1.5, 1.5);
    this.texture.normal.wrapS = THREE.RepeatWrapping;
    this.texture.normal.wrapT = THREE.RepeatWrapping;
  }
  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: this.texture.color,
      normalMap: this.texture.normal,
    });
  }
  createMesh() {
    this.setTextures();
    this.setMaterial();
    this.setGeometry();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.scene.add(this.mesh);
  }
}
