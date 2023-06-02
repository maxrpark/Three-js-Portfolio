import {
  BoxGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
} from "three";
import CANNON from "cannon";
import { Experience } from "../../experience/Experience";
import { PhysicsWorld } from "../../experience/utils";
import Resources from "../../experience/utils/Resources";
import { MeshTextureInt } from "../../ts/globalnterfaces";

interface Props {
  floorSize: number;
}

export default class GroundFloor {
  private experience: Experience;
  private geometry: BoxGeometry;
  private material: MeshStandardMaterial;
  public mesh: Mesh;

  private towerBody: CANNON.Body;
  private physics: PhysicsWorld;
  private resources: Resources;
  public textures: MeshTextureInt; // todo pubic private

  floorSize: number;

  constructor(props: Props) {
    Object.assign(this, props);
    this.experience = new Experience();
    this.physics = this.experience.physics;

    this.resources = this.experience.resources;

    this.createMesh();
    this.setBody();
  }
  private setGeometry() {
    this.geometry = new BoxGeometry(
      this.floorSize,
      this.floorSize,
      this.floorSize
    );
  }

  private setTexture() {
    // const color = Math.floor(Math.random() * 16777215).toString(16);
    this.textures = {
      map: this.resources.items.towerFloorColor,
      normalMap: this.resources.items.towerFloorNormal,
      displacementMap: this.resources.items.towerFloorHeight,
      displacementScale: 0.001,
      roughnessMap: this.resources.items.towerFloorRoughness,
      aoMap: this.resources.items.towerFloorAOM,
      roughness: 0.2,
      // color: `#${color}`,
    };

    this.geometry.setAttribute(
      "uv2",
      //@ts-ignore
      new Float32BufferAttribute(this.geometry.attributes.uv.array, 2)
    );
  }

  private setMaterial() {
    this.setTexture();

    this.material = new MeshStandardMaterial({
      ...this.textures,
    });
  }
  private setBody() {
    this.towerBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, this.floorSize * 0.5, 0),
      shape: new CANNON.Box(
        new CANNON.Vec3(
          this.floorSize * 0.5,
          this.floorSize * 0.5,
          this.floorSize * 0.5
        )
      ),
      allowSleep: true, // Enable sleeping
      sleepSpeedLimit: 0.1,
    });

    this.physics.world.addBody(this.towerBody);
  }

  private createMesh() {
    this.setGeometry();
    this.setMaterial();
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.y = this.floorSize / 2;
  }
}
