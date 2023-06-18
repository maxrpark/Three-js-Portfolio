import { Experience } from "../../../../experience/Experience";
import PhysicsWorld from "../../../../experience/utils/Physics";
import * as CANNON from "cannon";
export default class Maze {
  experience: Experience;
  physics: PhysicsWorld;
  bodiesGroup: CANNON.Body;

  constructor() {
    this.experience = new Experience();
    this.physics = this.experience.physics;

    this.setMazeBody();
  }

  setMazeBody() {
    const wallWidth = 0.02;
    const height = 1;
    const mazeDepth = 6;

    const angle = Math.PI / 2; // 90 degrees in radians

    // Create a quaternion representing the rotation
    const rotationQuaternion = new CANNON.Quaternion();
    rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), angle);

    this.bodiesGroup = new CANNON.Body({
      position: new CANNON.Vec3(8, height * 0.5, 0),
    });

    // wall1
    const wall1 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, (mazeDepth / 1.12) * 0.5)
      ),
      mass: 0,
    });

    wall1.quaternion.mult(rotationQuaternion, wall1.quaternion);

    const wall1Position = new CANNON.Vec3(0.32, 0, -2.9);

    this.bodiesGroup.addShape(wall1.shapes[0], wall1Position, wall1.quaternion);

    // wall2
    const wall2 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, (mazeDepth / 1.07) * 0.5)
      ),
      mass: 0,
    });

    const wall2Position = new CANNON.Vec3(2.9, 0, 0.06);

    this.bodiesGroup.addShape(
      wall2.shapes[0],
      wall2Position,
      new CANNON.Quaternion()
    );

    // wall3
    const wall3 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, (mazeDepth / 2.7) * 0.5)
      ),
      mass: 0,
    });

    wall3.quaternion.mult(rotationQuaternion, wall3.quaternion);

    const wall3Position = new CANNON.Vec3(1.7, 0, 2.9);

    this.bodiesGroup.addShape(
      wall3.shapes[0],
      wall3Position,
      // new CANNON.Quaternion()
      wall3.quaternion
    );

    // wall4
    const wall4 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, (mazeDepth / 2.2) * 0.5)
      ),
      mass: 0,
    });

    wall4.quaternion.mult(rotationQuaternion, wall4.quaternion);

    const wall4Position = new CANNON.Vec3(-1.4, 0, 2.9);

    this.bodiesGroup.addShape(
      wall4.shapes[0],
      wall4Position,
      // new CANNON.Quaternion()
      wall4.quaternion
    );

    // wall5
    const wall5 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, mazeDepth * 0.5)
      ),
      mass: 0,
    });

    const wall5Position = new CANNON.Vec3(-2.9, 0, -0.06);

    this.bodiesGroup.addShape(
      wall5.shapes[0],
      wall5Position,
      new CANNON.Quaternion()
    );

    // wall6
    const wall6 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, (mazeDepth / 2.15) * 0.5)
      ),
      mass: 0,
    });

    wall6.quaternion.mult(rotationQuaternion, wall6.quaternion);

    const wall6Position = new CANNON.Vec3(-1.5, 0, -2.3);

    this.bodiesGroup.addShape(wall6.shapes[0], wall6Position, wall6.quaternion);

    // //////SHAPE L
    // wall7

    const wall7 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.4 * 0.5)
      ),
      mass: 0,
    });

    const wall7Position = new CANNON.Vec3(0.57, 0, -2.5);

    this.bodiesGroup.addShape(
      wall7.shapes[0],
      wall7Position,
      new CANNON.Quaternion()
    );

    // wall8
    const wall8 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.4 * 0.5)
      ),
      mass: 0,
    });

    wall8.quaternion.mult(rotationQuaternion, wall8.quaternion);

    const wall8Position = new CANNON.Vec3(0.9, 0, -2.3);

    this.bodiesGroup.addShape(wall8.shapes[0], wall8Position, wall8.quaternion);

    // ////// SHAPE L END

    // wall9
    const wall9 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, (mazeDepth / 1.4) * 0.5)
      ),
      mass: 0,
    });

    const wall9Position = new CANNON.Vec3(1.75, 0, -0.5);

    this.bodiesGroup.addShape(
      wall9.shapes[0],
      wall9Position,
      new CANNON.Quaternion()
    );

    // wall10
    const wall10 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.4 * 0.5)
      ),
      mass: 0,
    });

    wall10.quaternion.mult(rotationQuaternion, wall10.quaternion);

    const wall10Position = new CANNON.Vec3(2.6, 0, -2.3);

    this.bodiesGroup.addShape(
      wall10.shapes[0],
      wall10Position,
      wall10.quaternion
    );

    // wall11
    const wall11 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, (mazeDepth / 4) * 0.5)
      ),
      mass: 0,
    });

    wall11.quaternion.mult(rotationQuaternion, wall11.quaternion);

    const wall11Position = new CANNON.Vec3(-2, 0, -1.7);

    this.bodiesGroup.addShape(
      wall11.shapes[0],
      wall11Position,
      wall11.quaternion
    );
    // wall12
    const wall12 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, (mazeDepth / 4) * 0.5)
      ),
      mass: 0,
    });

    wall12.quaternion.mult(rotationQuaternion, wall12.quaternion);

    const wall12Position = new CANNON.Vec3(0.8, 0, -1.7);

    this.bodiesGroup.addShape(
      wall12.shapes[0],
      wall12Position,
      wall12.quaternion
    );

    // //////SHAPE L 13/14
    // wall13

    const wall13 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.4 * 0.5)
      ),
      mass: 0,
    });

    const wall13Position = new CANNON.Vec3(2.3, 0, -1.5);

    this.bodiesGroup.addShape(
      wall13.shapes[0],
      wall13Position,
      new CANNON.Quaternion()
    );

    // wall14
    const wall14 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.4 * 0.5)
      ),
      mass: 0,
    });

    wall14.quaternion.mult(rotationQuaternion, wall14.quaternion);

    const wall14Position = new CANNON.Vec3(2.55, 0, -1.2);

    this.bodiesGroup.addShape(
      wall14.shapes[0],
      wall14Position,
      wall14.quaternion
    );

    // ////// SHAPE L END

    // wall15
    const wall15 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, (mazeDepth / 5) * 0.5)
      ),
      mass: 0,
    });

    wall15.quaternion.mult(rotationQuaternion, wall15.quaternion);

    const wall15Position = new CANNON.Vec3(-1.7, 0, -1.15);

    this.bodiesGroup.addShape(
      wall15.shapes[0],
      wall15Position,
      wall15.quaternion
    );

    // wall16

    const wall16 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.4 * 0.5)
      ),
      mass: 0,
    });

    const wall16Position = new CANNON.Vec3(-1.15, 0, -1.5);

    this.bodiesGroup.addShape(
      wall16.shapes[0],
      wall16Position,
      new CANNON.Quaternion()
    );
    // wall17

    const wall17 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 2.1 * 0.5)
      ),
      mass: 0,
    });

    const wall17Position = new CANNON.Vec3(-0.55, 0, -1);

    this.bodiesGroup.addShape(
      wall17.shapes[0],
      wall17Position,
      new CANNON.Quaternion()
    );
    // wall18

    const wall18 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 1 * 0.5)
      ),
      mass: 0,
    });

    const wall18Position = new CANNON.Vec3(-0, 0, -1.2);

    this.bodiesGroup.addShape(
      wall18.shapes[0],
      wall18Position,
      new CANNON.Quaternion()
    );

    ////

    this.physics.world.addBody(this.bodiesGroup);
  }
}
