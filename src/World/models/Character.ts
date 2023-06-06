// import {
//   Mesh,
//   Vector3,
// } from "three";
// import { Experience } from "../../experience/Experience";
// import { Camera } from "../../experience/Camera";
// import { gsap } from "gsap";
// import Resources from "../../experience/utils/Resources";

// export default class Character {
//   experience: Experience;
//   camera: Camera;
//   mesh: Mesh;
//   cameraCurrentPosition: Vector3;
//   cameraCurrentLockAt: Vector3;
//   model: Mesh;
//   resources: Resources;
//   movementSpeed: number = 0.1;
//   keysPressed: {
//     ArrowUp: boolean;
//     ArrowDown: boolean;
//     ArrowLeft: boolean;
//     ArrowRight: boolean;
//   };
//   canRotate: boolean = true;
//   canUpdate: boolean = false;
//   forwardDirection: Vector3;

//   constructor() {
//     this.experience = new Experience();

//     this.experience = new Experience();
//     this.resources = this.experience.resources;
//     this.camera = this.experience.camera;

//     this.cameraCurrentPosition = new Vector3();
//     this.cameraCurrentLockAt = new Vector3();

//     this.setControllers();
//     this.setCharacter();
//   }

//   setCharacter() {
//     // @ts-ignore
//     this.model = this.resources.items.male_character.scene;
//     this.model.position.set(3, 0.3, 0);
//     this.model.rotateY(Math.PI);

//     this.model.scale.set(0.007, 0.007, 0.007);

//     this.canUpdate = true;
//   }

//   setControllers() {
//     this.keysPressed = {
//       ArrowUp: false,
//       ArrowDown: false,
//       ArrowLeft: false,
//       ArrowRight: false,
//     };

//     this.forwardDirection = new Vector3(0, 0, 1);
//     window.addEventListener("keydown", (event) => {
//       //@ts-ignore
//       this.keysPressed[event.code] = true;
//     });

//     window.addEventListener("keyup", (event) => {
//       if (this.keysPressed.ArrowDown && !this.keysPressed.ArrowUp) {
//         this.canRotate = true;
//       }
//       //@ts-ignore
//       this.keysPressed[event.code] = false;
//     });
//   }

//   updateCamera() {
//     const idealOffset = new Vector3(0, 2.5, -3);
//     const idealLookAt = new Vector3(0, 2, 0);

//     const lerp = 0.1;

//     const modelPosition = this.model.position.clone();

//     const idealOffsetWorld = idealOffset
//       .clone()
//       .applyQuaternion(this.model.quaternion)
//       .add(modelPosition);
//     const idealLookAtWorld = idealLookAt
//       .clone()
//       .applyQuaternion(this.model.quaternion)
//       .add(modelPosition);

//     this.cameraCurrentPosition.lerp(idealOffsetWorld, lerp);
//     this.cameraCurrentLockAt.lerp(idealLookAtWorld, lerp);

//     this.camera.camera.position.copy(this.cameraCurrentPosition);
//     this.camera.camera.lookAt(this.cameraCurrentLockAt);
//   }

//   public update() {
//     if (!this.canUpdate) return;

//     if (this.keysPressed.ArrowUp) {
//       const forwardDirection = new Vector3(0, 0, 1);
//       forwardDirection.applyQuaternion(this.model.quaternion);
//       forwardDirection.normalize();
//       this.model.position.add(
//         forwardDirection.multiplyScalar(this.movementSpeed)
//       );
//     }

//     if (this.keysPressed.ArrowDown && !this.keysPressed.ArrowUp) {
//       if (this.canRotate) {
//         this.canRotate = false;
//         gsap.to(this.model.rotation, {
//           y: `+=${Math.PI}`,
//         });
//       }
//     }

//     if (this.keysPressed.ArrowLeft && !this.keysPressed.ArrowRight) {
//       this.model.rotation.y -= 0.1;
//     }

//     if (this.keysPressed.ArrowRight && !this.keysPressed.ArrowLeft) {
//       this.model.rotation.y += 0.1;
//     }

//     this.updateCamera();
//   }
// }

import { AnimationMixer, Mesh, Vector3 } from "three";
import { Experience } from "../../experience/Experience";
import { Camera } from "../../experience/Camera";
import { gsap } from "gsap";
import { Time } from "../../experience/utils";

class Model {
  modelAnimations: any; // TODO
  mesh: Mesh;

  constructor(mesh: any) {
    // @ts-ignore
    this.modelAnimations = mesh.animations;

    this.mesh = mesh.scene;
    this.mesh.position.set(3, 0.3, 0);
    this.mesh.rotateY(Math.PI);
    this.mesh.scale.set(0.007, 0.007, 0.007);
  }

  movingDirection(type: "forward" | "backward") {
    const directionZ = type === "forward" ? 1 : -1;
    const velocity = 0.03;

    const direction = new Vector3(0, 0, directionZ);
    direction.applyQuaternion(this.mesh.quaternion);
    direction.normalize();
    this.mesh.position.add(direction.multiplyScalar(velocity));
  }

  moveForward() {
    this.movingDirection("forward");
  }

  rotateModelBy180Degrees() {
    gsap.to(this.mesh.rotation, {
      y: `+=${Math.PI}`,
    });
  }

  rotate(rotationAngle: number) {
    this.mesh.rotation.y += rotationAngle;
  }
}

class Controllers {
  keysPressed: {
    ArrowUp: boolean;
    ArrowDown: boolean;
    ArrowLeft: boolean;
    ArrowRight: boolean;
  };

  canRotate: boolean = true;

  constructor() {
    this.keysPressed = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };

    window.addEventListener("keydown", (event) => {
      //@ts-ignore
      this.keysPressed[event.code] = true;
    });

    window.addEventListener("keyup", (event) => {
      if (this.keysPressed.ArrowDown && !this.keysPressed.ArrowUp) {
        this.canRotate = true;
      }
      //@ts-ignore
      this.keysPressed[event.code as string] = false;
    });
  }
}

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

    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    this.playAnimation("idle");

    // Look_Down;
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
  controllers: Controllers;
  animations: Animations;
  cameraCurrentPosition: Vector3;
  cameraCurrentLockAt: Vector3;
  movementSpeed: number = 0.1;
  forwardDirection: Vector3;
  isWalking: boolean = false;

  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.cameraCurrentPosition = new Vector3();
    this.cameraCurrentLockAt = new Vector3();

    this.model = new Model(this.experience.resources.items.male_character);

    this.controllers = new Controllers();
    this.animations = new Animations(this.model);

    this.forwardDirection = new Vector3(0, 0, -1);
  }

  updateCamera() {
    const idealOffset = new Vector3(0, 2.5, -3);
    const idealLookAt = new Vector3(0, 2, 0);
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
    this.animations.update();
    if (this.controllers.keysPressed.ArrowUp) {
      this.model.moveForward();
      if (!this.isWalking) {
        this.isWalking = true;
        this.animations.playAnimation("walking");
      }
    }
    if (!this.controllers.keysPressed.ArrowUp) {
      if (this.isWalking) {
        this.isWalking = false;
        this.animations.playAnimation("idle");
      }
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
      this.model.rotate(-0.1);
    }

    if (
      this.controllers.keysPressed.ArrowRight &&
      !this.controllers.keysPressed.ArrowLeft
    ) {
      this.model.rotate(0.1);
    }

    this.updateCamera();
  }
}
