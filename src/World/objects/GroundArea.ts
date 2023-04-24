import {
  MeshStandardMaterial,
  Mesh,
  PlaneGeometry,
  Float32BufferAttribute,
  // sRGBEncoding,
} from "three";
import CANNON from "cannon";
import { Experience } from "../../experience/Experience";
import { PhysicsWorld } from "../../experience/utils";
import Resources from "../../experience/utils/Resources";
import { MeshTextureInt } from "../../ts/globalnterfaces";

export default class GroundArea {
  experience: Experience;
  physics: PhysicsWorld;
  geometry: PlaneGeometry;
  material: MeshStandardMaterial;
  mesh: Mesh;
  groundBody: CANNON.Body;
  resources: Resources;
  textures: MeshTextureInt;

  constructor() {
    this.experience = new Experience();
    this.physics = this.experience.physics;

    this.resources = this.experience.resources;

    this.createMesh();
  }
  setGeometry() {
    this.geometry = new PlaneGeometry(5, 5, 50, 50);
  }
  setTextures() {
    this.textures = {
      map: this.resources.items.concreteColor,
      normalMap: this.resources.items.concreteNormal,
      displacementMap: this.resources.items.concreteHeight,
      displacementScale: 0.1,
      roughnessMap: this.resources.items.concreteRoughness,
      aoMap: this.resources.items.concreteAOM,
      roughness: 2,
    };

    this.geometry.setAttribute(
      "uv2",
      //@ts-ignore
      new Float32BufferAttribute(this.geometry.attributes.uv.array, 2)
    );
  }
  setMaterial() {
    this.setTextures();
    this.material = new MeshStandardMaterial({
      ...this.textures,
    });
  }
  setBody() {
    const shape = new CANNON.Plane();
    this.groundBody = new CANNON.Body({
      mass: 0,
      shape,
    });
    this.groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );

    this.physics.world.addBody(this.groundBody);
  }
  createMesh() {
    this.setBody();
    this.setGeometry();
    this.setMaterial();
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
  }
}
