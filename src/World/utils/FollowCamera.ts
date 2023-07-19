import { Camera, Quaternion, Vector3 } from "three";
import { Experience } from "../../experience/Experience";

interface Props {
  idealOffset: Vector3;
  idealLookAt: Vector3;
}

export default class FollowCamera {
  experience: Experience;
  camera: Camera;
  cameraCurrentPosition: Vector3;
  cameraCurrentLockAt: Vector3;
  idealOffset: Vector3;
  idealLookAt: Vector3;

  constructor(props: Props) {
    Object.assign(this, props);
    this.experience = new Experience();
    this.camera = this.experience.camera.camera;
    this.cameraCurrentPosition = new Vector3();
    this.cameraCurrentLockAt = new Vector3();
  }

  updateIdealOffset(idealOffset: Vector3) {
    this.idealOffset = idealOffset;
  }

  updateCamera(
    modelPosition: Vector3,
    modelQuaternion: Quaternion,
    lerp = 0.06
  ) {
    const position = modelPosition.clone();

    const idealOffsetWorld = this.idealOffset
      .clone()
      .applyQuaternion(modelQuaternion)
      .add(position);
    const idealLookAtWorld = this.idealLookAt
      .clone()
      .applyQuaternion(modelQuaternion)
      .add(position);

    this.cameraCurrentPosition.lerp(idealOffsetWorld, lerp);
    this.cameraCurrentLockAt.lerp(idealLookAtWorld, lerp);

    this.camera.position.copy(this.cameraCurrentPosition);
    this.camera.lookAt(this.cameraCurrentLockAt);
  }
}
