import { AnimationMixer, Box3, Euler, Mesh, Vector3 } from "three";
import { Experience } from "../../experience/Experience";
import { Camera } from "../../experience/Camera";
import { gsap } from "gsap";

import { PhysicsWorld, Time } from "../../experience/utils";
import * as CANNON from "cannon";

import { CharacterController } from "../utils";

class Model {
  private experience: Experience;
  private physics: PhysicsWorld;
  modelAnimations: any; // TODO
  mesh: Mesh;
  body: CANNON.Body;
  private pivotOffset: Vector3 | CANNON.Vec3;
  private meshPositionPivot: Vector3 | CANNON.Vec3;
  private eulerRotation: Euler;

  constructor(mesh: any) {
    this.experience = new Experience();
    this.physics = this.experience.physics;
    // @ts-ignore
    this.modelAnimations = mesh.animations;

    const modelScale = new Vector3(0.003, 0.003, 0.003);
    this.mesh = mesh.scene;

    this.mesh.rotateY(Math.PI);
    this.mesh.scale.set(modelScale.x, modelScale.y, modelScale.z);

    this.eulerRotation = new Euler(0, 0, 0, "XYZ");

    const boundingBox = new Box3();
    boundingBox.setFromObject(this.mesh);

    const size = new Vector3();
    boundingBox.getSize(size);

    const halfExtents = new CANNON.Vec3(
      0.5 * size.x,
      0.5 * size.y,
      0.5 * size.z
    );

    this.body = new CANNON.Body({
      shape: new CANNON.Box(halfExtents),
      mass: 1,
      position: new CANNON.Vec3(1, 1, 0),
      allowSleep: false,
    });

    this.physics.world.addBody(this.body);

    this.pivotOffset = new CANNON.Vec3(0, -halfExtents.y + 0.2, 0); // Adjust
    this.meshPositionPivot = new CANNON.Vec3();
  }

  moveForward(velocity = 1) {
    const directionZ = 1;

    const forwardDirection = new CANNON.Vec3(0, 0, directionZ);
    this.body.vectorToWorldFrame(forwardDirection, forwardDirection);

    const velocityVector = forwardDirection.scale(velocity);
    this.body.velocity.copy(velocityVector);

    this.body.angularDamping = 1;
  }

  rotateModelBy180Degrees() {
    gsap.to(this.eulerRotation, {
      y: `+=${Math.PI}`,
      onUpdate: () => {
        this.body.quaternion.setFromEuler(
          this.eulerRotation.x,
          this.eulerRotation.y,
          this.eulerRotation.z,
          "XYZ"
        );
      },
    });
  }

  rotate(rotationAngle: number) {
    const quaternion = new CANNON.Quaternion();
    quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0.6, 0), rotationAngle);
    this.body.quaternion.mult(quaternion, this.body.quaternion);

    // Update eulerRotation
    // this.eulerRotation.setFromQuaternion(this.body.quaternion as any, "XYZ");
  }

  public update() {
    this.body.position.vadd(
      this.pivotOffset as any,
      this.meshPositionPivot as any
    );

    this.mesh.position.copy(this.meshPositionPivot as any);
    this.mesh.quaternion.copy(this.body.quaternion as any);
  }
}

// class Controllers {
//   keysPressed: {
//     ArrowUp: boolean;
//     ArrowDown: boolean;
//     ArrowLeft: boolean;
//     ArrowRight: boolean;
//     ShiftLeft: boolean;
//   };

//   canRotate: boolean = true;
//   // Mobile
//   directionalController: HTMLElement;

//   constructor() {
//     this.keysPressed = {
//       ArrowUp: false,
//       ArrowDown: false,
//       ArrowLeft: false,
//       ArrowRight: false,
//       ShiftLeft: false,
//     };

//     this.setDesktopControllers();

//     // MOBILE
//     this.setMobileControllers();
//   }

//   setDesktopControllers() {
//     window.addEventListener("keydown", (event) => {
//       //@ts-ignore
//       this.keysPressed[event.code] = true;
//     });

//     window.addEventListener("keyup", (event) => {
//       if (this.keysPressed.ArrowDown && !this.keysPressed.ArrowUp) {
//         this.canRotate = true;
//       }
//       //@ts-ignore
//       this.keysPressed[event.code as string] = false;
//     });
//   }

//   setMobileControllers() {
//     this.directionalController = document.getElementById(
//       "directionalController"
//     )!;

//     const self = this;

//     Draggable.create(this.directionalController, {
//       bounds: "#directionalControllerWrapper",
//       inertia: false,

//       onDrag: function () {
//         if (this.getDirection() === "up") {
//           self.keysPressed.ArrowUp = true;
//           self.keysPressed.ArrowRight = false;
//           self.keysPressed.ArrowLeft = false;
//           self.keysPressed.ArrowDown = false;
//           self.canRotate = true;
//         }
//         if (this.getDirection() === "right") {
//           self.keysPressed.ArrowRight = true;
//           self.keysPressed.ArrowLeft = false;
//         }

//         if (this.getDirection() === "left") {
//           self.keysPressed.ArrowLeft = true;
//           self.keysPressed.ArrowRight = false;
//         }
//         if (this.getDirection() === "down" && !self.keysPressed.ShiftLeft) {
//           self.keysPressed.ArrowUp = false;
//           self.keysPressed.ArrowRight = false;
//           self.keysPressed.ArrowLeft = false;
//           self.keysPressed.ArrowDown = true;
//         }
//       },
//       onDragEnd: function () {
//         gsap.set(self.directionalController, {
//           clearProps: "all",
//         });

//         self.keysPressed = {
//           ...self.keysPressed,
//           ArrowUp: false,
//           ArrowDown: false,
//           ArrowLeft: false,
//           ArrowRight: false,
//         };
//         self.canRotate = true;
//       },
//     });

//     function ignoreEvent(e: any) {
//       e.preventDefault();
//       e.stopImmediatePropagation();
//       if (e.preventManipulation) {
//         e.preventManipulation();
//       }
//       return false;
//     }

//     this.directionalController.addEventListener(
//       "touchstart",
//       ignoreEvent,
//       false
//     );
//     this.directionalController.addEventListener("touchend", ignoreEvent, false);

//     const runBtn = document.getElementById("runBtn")!;
//     runBtn.addEventListener("touchstart", (event: any) => {
//       event.stopPropagation();
//       runBtn.classList.add("running");
//       this.keysPressed.ShiftLeft = true;
//     });
//     runBtn.addEventListener("touchend", (event: any) => {
//       event.stopPropagation();
//       runBtn.classList.remove("running");
//       this.keysPressed.ShiftLeft = false;
//     });
//   }
// }

class Animations {
  model: Model;
  experience: Experience;
  time: Time;
  animationValue: number;

  animation: {
    mixer: AnimationMixer;
    actions: any;
  };

  constructor(model: Model) {
    this.model = model;

    this.experience = new Experience();
    this.time = this.experience.time;

    this.animate();
  }

  animate() {
    this.animation = {
      mixer: new AnimationMixer(this.model.mesh),
      actions: {},
    };

    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.model.modelAnimations[7]
    );
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.model.modelAnimations[0]
    );
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.model.modelAnimations[3]
    );

    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    this.playAnimation("idle");
  }

  playAnimation(name: string) {
    const newAction = this.animation.actions[name];
    const oldAction = this.animation.actions.current;

    newAction.reset();
    newAction.play();
    newAction.crossFadeFrom(oldAction, 0.2);

    this.animation.actions.current = newAction;
  }

  update() {
    this.animation.mixer.update(this.time.delta);
  }
}

export default class Character {
  experience: Experience;
  camera: Camera;
  model: Model;
  controllers: CharacterController;
  animations: Animations;
  cameraCurrentPosition: Vector3;
  cameraCurrentLockAt: Vector3;
  isWalking: boolean = false;
  isRunning: boolean = false;

  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.cameraCurrentPosition = new Vector3();
    this.cameraCurrentLockAt = new Vector3();

    this.model = new Model(this.experience.resources.items.male_character);

    this.controllers = new CharacterController();
    this.animations = new Animations(this.model);
  }

  updateCamera() {
    const idealOffset = new Vector3(0, 1.5, -1.5);
    const idealLookAt = new Vector3(0, 1, 0);
    const lerp = 0.1;
    const modelPosition = this.model.mesh.position.clone();

    const idealOffsetWorld = idealOffset
      .clone()
      .applyQuaternion(this.model.mesh.quaternion)
      .add(modelPosition);
    const idealLookAtWorld = idealLookAt
      .clone()
      .applyQuaternion(this.model.mesh.quaternion)
      .add(modelPosition);

    this.cameraCurrentPosition.lerp(idealOffsetWorld, lerp);
    this.cameraCurrentLockAt.lerp(idealLookAtWorld, lerp);

    this.camera.camera.position.copy(this.cameraCurrentPosition);
    this.camera.camera.lookAt(this.cameraCurrentLockAt);
  }

  update() {
    if (this.controllers.keysPressed.ArrowUp) {
      this.model.moveForward();
      if (!this.isWalking) {
        this.isWalking = true;
        this.animations.playAnimation("walking");
      }
    }
    if (
      this.controllers.keysPressed.ArrowUp &&
      this.controllers.keysPressed.ShiftLeft
    ) {
      this.model.moveForward(3);

      if (!this.isRunning) {
        this.isRunning = true;
        this.animations.playAnimation("running");
      }
    }
    if (!this.controllers.keysPressed.ArrowUp && this.isWalking) {
      this.isWalking = false;
      this.isRunning = false;
      this.animations.playAnimation("idle");
    }

    if (!this.controllers.keysPressed.ShiftLeft && this.isRunning) {
      this.isRunning = false;
      this.animations.playAnimation("walking");
    }

    if (
      this.controllers.keysPressed.ArrowDown &&
      !this.controllers.keysPressed.ArrowUp
    ) {
      if (this.controllers.canRotate) {
        this.model.rotateModelBy180Degrees();
        this.controllers.canRotate = false;
      }
    }

    if (
      this.controllers.keysPressed.ArrowLeft &&
      !this.controllers.keysPressed.ArrowRight
    ) {
      this.model.rotate(0.05);
    }

    if (
      this.controllers.keysPressed.ArrowRight &&
      !this.controllers.keysPressed.ArrowLeft
    ) {
      this.model.rotate(-0.05);
    }

    // Mobile controller

    this.updateCamera();
    this.model.update();
    this.animations.update();
  }
}
