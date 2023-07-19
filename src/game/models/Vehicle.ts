import { AnimationClip, Box3, Euler, Group, Vector3 } from "three";
import { Experience } from "../../experience/Experience";

import { PhysicsWorld } from "../../experience/utils";
import * as CANNON from "cannon";

import { CharacterController, FollowCamera } from "../utils";
import { LocalStorageKeys } from "../../ts/globalTs";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/helperFunctions";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

class Model {
  private experience: Experience;
  private physics: PhysicsWorld;
  modelAnimations: AnimationClip[];
  mesh: Group;
  body: CANNON.Body;
  private pivotOffset: Vector3 | CANNON.Vec3;
  private meshPositionPivot: Vector3 | CANNON.Vec3;
  private eulerRotation: Euler;
  positionSaved: boolean;

  constructor(mesh: GLTF) {
    this.experience = new Experience();
    this.physics = this.experience.physics;
    this.modelAnimations = mesh?.animations;
    this.mesh = mesh.scene;

    this.setVehicle();
  }

  setVehicle() {
    this.mesh.name = "vehicle";

    this.eulerRotation = new Euler(0, 0, 0, "XYZ");

    const boundingBox = new Box3();
    boundingBox.setFromObject(this.mesh);

    const size = new Vector3();
    boundingBox.getSize(size);

    const halfExtents = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2);

    this.pivotOffset = new CANNON.Vec3(0, -halfExtents.y + 0.05, 0);
    this.meshPositionPivot = new CANNON.Vec3();

    this.body = new CANNON.Body({
      shape: new CANNON.Box(halfExtents),
      mass: 150,

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

  position(x = -1, y = 0, z = -6.9) {
    this.body.position = new CANNON.Vec3(x, y, z);
    this.mesh.position.set(x, y, z);
  }

  saveModelPosition() {
    const positions = getLocalStorageItem(LocalStorageKeys.POSITIONS);

    positions.vehicle = this.body.position;

    setLocalStorageItem(LocalStorageKeys.POSITIONS, positions);
    this.positionSaved = true;
  }

  setInitialPosition() {
    const meshSavedPosition = getLocalStorageItem(
      LocalStorageKeys.POSITIONS
    ).vehicle;

    if (meshSavedPosition) {
      const { x, z } = meshSavedPosition;
      this.body.position = new CANNON.Vec3(x, 0, z);
      this.mesh.position.set(x, 0, z);
    } else {
      this.position();
    }
  }

  moveVehicle(velocity = 6) {
    const directionZ = 1;
    const forwardDirection = new CANNON.Vec3(0, 0, directionZ);
    this.body.vectorToWorldFrame(forwardDirection, forwardDirection);

    const velocityVector = forwardDirection.scale(velocity);
    this.body.velocity.copy(velocityVector);
    this.body.angularDamping = 1;
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

export default class Vehicle {
  experience: Experience;
  model: Model;
  controllers: CharacterController;
  followCamera: FollowCamera;

  constructor(controllers: CharacterController) {
    this.experience = new Experience();
    this.controllers = controllers;
    this.model = new Model(this.experience.resources.items.Car as GLTF);
    this.followCamera = new FollowCamera({
      idealLookAt: new Vector3(0, 1, 0),
      idealOffset: new Vector3(0, 20, -12),
    });
  }

  drivingControllers() {
    if (
      this.controllers.keysPressed.ArrowUp &&
      !this.controllers.keysPressed.ShiftLeft
    ) {
      this.model.moveVehicle();
      this.model.positionSaved = false;
    }
    if (
      this.controllers.keysPressed.ArrowUp &&
      this.controllers.keysPressed.ShiftLeft
    ) {
      this.model.moveVehicle(12);
      this.model.positionSaved = false;
    }

    if (
      this.controllers.keysPressed.ArrowDown &&
      !this.controllers.keysPressed.ArrowUp
    ) {
      this.model.moveVehicle(-2);
    }

    if (
      this.controllers.keysPressed.ArrowLeft &&
      !this.controllers.keysPressed.ArrowRight
    ) {
      if (this.controllers.keysPressed.ArrowUp) {
        this.model.rotate(0.04);
      } else if (this.controllers.keysPressed.ArrowDown) {
        this.model.rotate(-0.04);
      }
    }

    if (
      this.controllers.keysPressed.ArrowRight &&
      !this.controllers.keysPressed.ArrowLeft
    ) {
      if (this.controllers.keysPressed.ArrowUp) {
        this.model.rotate(-0.04);
      } else if (this.controllers.keysPressed.ArrowDown) {
        this.model.rotate(0.04);
      }
    }
  }

  update() {
    if (
      !this.controllers.keysPressed.ArrowUp &&
      !this.controllers.keysPressed.ShiftLeft
    ) {
      if (!this.model.positionSaved) this.model.saveModelPosition();
    }

    this.drivingControllers();

    this.model.update();
    this.followCamera.updateCamera(
      this.model.mesh.position,
      this.model.mesh.quaternion
    );
  }
}
