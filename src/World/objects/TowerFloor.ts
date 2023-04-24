import { BoxGeometry, Camera, Mesh, MeshMatcapMaterial } from "three";
import CANNON from "cannon";
import { Experience } from "../../experience/Experience";
import { PhysicsWorld, Time } from "../../experience/utils";
import { gsap } from "gsap";
import EventEmitter from "../../experience/utils/EventEmitter";

interface Props {
  positionY: number;
}
export default class TowerFloor extends EventEmitter {
  experience: Experience;
  camera: Camera;
  time: Time;
  geometry: BoxGeometry;
  material: MeshMatcapMaterial;
  mesh: Mesh;

  body: CANNON.Body;
  physics: PhysicsWorld;

  swinging: any;
  isFollowing: boolean;
  hasCollided: boolean;

  //

  positionY: number;

  constructor(props?: Props) {
    super();
    Object.assign(this, props);
    this.experience = new Experience();
    this.camera = this.experience.camera.camera;
    this.time = this.experience.time;
    this.physics = this.experience.physics;

    this.hasCollided = false;
    this.isFollowing = false;

    this.createMesh();
    this.time.on("tick", () => this.update());
  }
  setGeometry() {
    this.geometry = new BoxGeometry(1, 1, 1);
  }
  setMaterial() {
    // const matcap = this.experience.resources.items.mapCap8;
    const color = Math.floor(Math.random() * 16777215).toString(16);

    this.material = new MeshMatcapMaterial({
      // @ts-ignore TODO
      // matcap,
      color: `#${color}`,
    });
  }
  setBody() {
    const shape = new CANNON.Box(new CANNON.Vec3(1 * 0.5, 1 * 0.5, 1 * 0.5));

    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, this.positionY + 5, 0),
      shape,
      allowSleep: true, // Enable sleeping
      sleepSpeedLimit: 0.1,
    });

    this.body.position.x = this.mesh.position.x;
    this.body.position.y = this.mesh.position.y;
    this.body.position.z = this.mesh.position.z;

    this.physics.world.addBody(this.body);
  }
  swingingAnimation() {
    this.swinging = gsap.timeline({ paused: true });

    this.swinging.fromTo(
      this.mesh.position,
      {
        x: 1,
      },
      { x: -1, repeat: -1, yoyo: true, ease: "none", duration: 1 }
    );
    this.swinging.play();
  }
  createMesh() {
    this.setGeometry();
    this.setMaterial();
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(0, this.positionY + 2, 0);

    gsap.to(this.camera.position, {
      y: this.mesh.position.y + this.positionY / 2,
    });

    this.camera.lookAt(this.mesh.position);

    this.swingingAnimation();
  }
  drop() {
    this.swinging.pause();
    this.setBody();
    this.isFollowing = true;

    this.body.addEventListener("collide", () => this.handleCollision());
  }
  handleCollision() {
    if (!this.hasCollided) {
      this.hasCollided = true;
      this.isFollowing = false;

      this.trigger("handleHasCollided");
    }
  }
  update() {
    if (this.body) {
      this.mesh.position.x = this.body.position.x;
      this.mesh.position.y = this.body.position.y;
      this.mesh.position.z = this.body.position.z;

      this.mesh.quaternion.copy(this.body.quaternion as any);
    }
  }

  reset() {
    this.body.removeEventListener("collide", () => this.handleCollision);
  }
}
