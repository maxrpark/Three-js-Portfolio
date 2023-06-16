import { BoxGeometry, Camera, Mesh, MeshStandardMaterial } from "three";
import CANNON from "cannon";
import { Experience } from "../../experience/Experience";
import { PhysicsWorld, Time } from "../../experience/utils";
import { gsap } from "gsap";
import EventEmitter from "../../experience/utils/EventEmitter";
import Resources from "../../experience/utils/Resources";
import { MeshTextureInt } from "../../ts/globalnterfaces";

interface Props {
  positionY: number;
  floorSize: number;
}
export default class TowerFloor extends EventEmitter {
  private experience: Experience;
  private camera: Camera;
  private time: Time;
  private physics: PhysicsWorld;
  private resources: Resources;

  private geometry: BoxGeometry;
  private material: MeshStandardMaterial;
  public textures: MeshTextureInt;
  public mesh: Mesh;
  public body: CANNON.Body;

  // variables
  private swinging: any;
  private isFalling: boolean;
  private hasCollided: boolean;

  // props
  positionY: number;
  floorSize: number;

  constructor(props?: Props) {
    super();
    Object.assign(this, props);
    this.experience = new Experience();
    this.camera = this.experience.camera.camera;
    this.time = this.experience.time;
    this.physics = this.experience.physics;

    this.resources = this.experience.resources;

    this.hasCollided = false;
    this.isFalling = false;

    this.createMesh();
    this.time.on("tick", () => this.update());
  }
  private setGeometry() {
    this.geometry = new BoxGeometry(
      this.floorSize,
      this.floorSize,
      this.floorSize
    );
  }
  private setTexture() {
    this.textures = {
      map: this.resources.items.towerFloorColor,
    };
  }
  private setMaterial() {
    this.setTexture();

    this.material = new MeshStandardMaterial({
      ...this.textures,
    });
  }
  private setBody() {
    this.body = new CANNON.Body({
      mass: 10,
      position: new CANNON.Vec3(0, this.positionY + 5, 0),
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

    this.mesh.userData.body = this.body;
    this.body.position.copy(this.mesh.position as any);
    this.physics.world.addBody(this.body);
  }
  private swingingAnimation() {
    this.swinging = gsap.timeline({ paused: true });

    this.swinging.fromTo(
      this.mesh.position,
      {
        x: -this.floorSize / 1.2,
        ease: "none",
      },
      {
        x: this.floorSize,
        repeat: -1,
        yoyo: true,
        ease: "none",
        duration: 1.2,
      }
    );
    // this.swinging.progress(0.5);
    this.swinging.play();
  }
  private createMesh() {
    this.setGeometry();
    this.setMaterial();
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(0, this.positionY + this.floorSize * 1.5, 0);

    gsap.to(this.camera.position, {
      y: this.mesh.position.y,
    });

    this.swingingAnimation();
  }
  public drop() {
    if (this.isFalling) return;
    this.swinging.pause();
    this.setBody();
    this.isFalling = true;

    this.body.addEventListener("collide", () => this.handleCollision());
  }
  private handleCollision() {
    if (!this.hasCollided) {
      this.hasCollided = true;
      this.isFalling = false;

      this.trigger("handleHasCollided");
    }
  }
  private update() {
    if (this.body) {
      this.mesh.position.copy(this.body.position as any);
      this.mesh.quaternion.copy(this.body.quaternion as any);
    }
  }

  public remove() {
    this.body.removeEventListener("collide", () => this.handleCollision);
  }
}
