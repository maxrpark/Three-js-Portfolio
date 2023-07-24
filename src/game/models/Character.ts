import {
  AnimationClip,
  AnimationMixer,
  Box3,
  Euler,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import * as CANNON from "cannon";
import { Experience } from "../../experience/Experience";
import { gsap } from "gsap";

import { PhysicsWorld, Time } from "../../experience/utils";

import { CharacterController, FollowCamera } from "../utils";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/helperFunctions";
import { LocalStorageKeys } from "../../ts/globalTs";

class Model {
  private experience: Experience;
  private physics: PhysicsWorld;
  private pivotOffset: Vector3 | CANNON.Vec3;
  private meshPositionPivot: Vector3 | CANNON.Vec3;
  private eulerRotation: Euler;

  modelAnimations: AnimationClip[];
  mesh: Group;
  body: CANNON.Body;
  positionSaved: boolean;

  constructor(mesh: GLTF) {
    this.experience = new Experience();
    this.physics = this.experience.physics;
    this.modelAnimations = mesh.animations;
    this.mesh = mesh.scene;

    this.setCharacter();
  }

  setCharacter() {
    const modelScale = new Vector3(1, 1, 1);

    this.mesh.traverse((child) => {
      if (
        child instanceof Mesh &&
        child.material instanceof MeshStandardMaterial
      ) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.mesh.rotateY(Math.PI);
    this.mesh.scale.set(modelScale.x, modelScale.y, modelScale.z);

    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.eulerRotation = new Euler(0, -1, 0, "XYZ");

    const boundingBox = new Box3();
    boundingBox.setFromObject(this.mesh);

    const size = new Vector3();
    boundingBox.getSize(size);

    const halfExtents = new CANNON.Vec3(
      0.9 * size.x,
      0.9 * size.y,
      0.5 * size.z
    );

    this.pivotOffset = new CANNON.Vec3(0, -halfExtents.y + 0.01, 0); // Adjust
    this.meshPositionPivot = new CANNON.Vec3();

    this.body = new CANNON.Body({
      shape: new CANNON.Box(halfExtents),
      mass: 1,

      allowSleep: false,
    });

    this.body.quaternion.setFromEuler(
      this.eulerRotation.x,
      this.eulerRotation.y,
      this.eulerRotation.z,
      "XYZ"
    );

    this.setInitialPosition();
    this.physics.world.addBody(this.body);
  }

  position(x = 0, y = 1, z = 11.5) {
    this.body.position = new CANNON.Vec3(x, y, z);
    this.mesh.position.set(x, 0.1, z);
  }

  setInitialPosition() {
    const meshSavedPosition = getLocalStorageItem(
      LocalStorageKeys.POSITIONS
    ).character;

    if (meshSavedPosition) {
      const { x, y, z } = meshSavedPosition;
      this.body.position = new CANNON.Vec3(x, y, z);
      this.mesh.position.set(x, y, z);
    } else {
      this.position();
    }

    this.body.quaternion.setFromEuler(
      this.eulerRotation.x,
      Math.PI,
      this.eulerRotation.z,
      "XYZ"
    );
  }

  savePlayerPosition() {
    const positions = getLocalStorageItem(LocalStorageKeys.POSITIONS);

    positions.character = this.body.position;
    setLocalStorageItem(LocalStorageKeys.POSITIONS, positions);
    this.positionSaved = true;
  }

  moveForward(velocity = 1) {
    const directionZ = velocity;

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
  }

  public update() {
    this.body.position.vadd(
      this.pivotOffset as CANNON.Vec3,
      this.meshPositionPivot as CANNON.Vec3
    );

    this.mesh.position.copy(this.meshPositionPivot as any);
    this.mesh.quaternion.copy(this.body.quaternion as any);
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
      this.model.modelAnimations[1]
    );
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.model.modelAnimations[2]
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
  model: Model;
  followCamera: FollowCamera;
  controllers: CharacterController;
  animations: Animations;

  cameraCurrentPosition: Vector3;
  cameraCurrentLockAt: Vector3;

  defaultOffset: Vector3;
  nearMazeOffset: Vector3;

  isWalking: boolean = false;
  isRunning: boolean = false;
  isNotMoving: boolean = true;
  isAroundMaze: boolean = false;
  showCarAlertMessage: boolean = true;

  constructor(controllers: CharacterController) {
    this.experience = new Experience();
    this.controllers = controllers;
    this.defaultOffset = new Vector3(0, 1, -2);
    this.nearMazeOffset = new Vector3(0, 6, -2.5);

    this.followCamera = new FollowCamera({
      idealLookAt: new Vector3(0, 0.7, 0),
      idealOffset: this.defaultOffset,
    });

    this.model = new Model(
      this.experience.resources.items.male_character_1 as GLTF
    );

    this.animations = new Animations(this.model);
  }

  characterController() {
    if (
      this.controllers.keysPressed.ArrowUp &&
      !this.controllers.keysPressed.ShiftLeft
    ) {
      this.model.moveForward();
      if (!this.isWalking) {
        this.isNotMoving = false;
        this.isWalking = true;
        this.model.positionSaved = false;
        this.animations.playAnimation("walking");
      }
    }
    if (
      this.controllers.keysPressed.ArrowUp &&
      this.controllers.keysPressed.ShiftLeft
    ) {
      this.model.moveForward(1.8);

      if (!this.isRunning) {
        this.isNotMoving = false;
        this.isRunning = true;
        this.model.positionSaved = false;
        this.animations.playAnimation("running");
      }
    }
    if (!this.controllers.keysPressed.ArrowUp && !this.isNotMoving) {
      this.isWalking = false;
      this.isRunning = false;
      this.isNotMoving = true;
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
      if (this.isRunning) {
        this.model.rotate(0.04);
      } else {
        this.model.rotate(0.05);
      }
    }

    if (
      this.controllers.keysPressed.ArrowRight &&
      !this.controllers.keysPressed.ArrowLeft
    ) {
      if (this.isRunning) {
        this.model.rotate(-0.04);
      } else {
        this.model.rotate(-0.05);
      }
    }
    if (
      this.controllers.keysPressed.Enter &&
      !this.experience.world.userProgress.canDrive
    ) {
      this.experience.world.toastNotification.showToast({
        title: `Vehicle not available`,
        text: "Collect all the coins to unlock it.",
        className: "completed",
        image: "",
      });
    }
  }

  update() {
    if (!this.isRunning && !this.isWalking) {
      if (!this.model.positionSaved) this.model.savePlayerPosition();
    }

    if (this.isAroundMaze) {
      this.followCamera.updateIdealOffset(this.nearMazeOffset);
    } else {
      this.followCamera.updateIdealOffset(this.defaultOffset);
    }
    this.followCamera.updateCamera(
      this.model.mesh.position,
      this.model.mesh.quaternion,
      0.1
    );
    this.characterController();
    this.animations.update();

    this.model.update();
  }
}
