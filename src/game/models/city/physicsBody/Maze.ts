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
    const wallWidth = 0.18;
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
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, (mazeDepth / 1.35) * 0.5)
      ),
      mass: 0,
    });

    const wall9Position = new CANNON.Vec3(1.75, 0, -0.55);

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
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.5 * 0.5)
      ),
      mass: 0,
    });

    const wall16Position = new CANNON.Vec3(-1.17, 0, -1.5);

    this.bodiesGroup.addShape(
      wall16.shapes[0],
      wall16Position,
      new CANNON.Quaternion()
    );
    // wall17

    const wall17 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 2.2 * 0.5)
      ),
      mass: 0,
    });

    const wall17Position = new CANNON.Vec3(-0.55, 0, -1.1);

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

    // wall19
    const wall19 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.6 * 0.5)
      ),
      mass: 0,
    });

    wall19.quaternion.mult(rotationQuaternion, wall19.quaternion);

    const wall19Position = new CANNON.Vec3(0.83, 0, -1.15);

    this.bodiesGroup.addShape(
      wall19.shapes[0],
      wall19Position,
      wall19.quaternion
    );
    // wall20
    const wall20 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.4 * 0.5)
      ),
      mass: 0,
    });

    wall20.quaternion.mult(rotationQuaternion, wall20.quaternion);

    const wall20Position = new CANNON.Vec3(-2.6, 0, -0.6);

    this.bodiesGroup.addShape(
      wall20.shapes[0],
      wall20Position,
      wall20.quaternion
    );
    // wall21
    const wall21 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 1.1 * 0.5)
      ),
      mass: 0,
    });

    wall21.quaternion.mult(rotationQuaternion, wall21.quaternion);

    const wall21Position = new CANNON.Vec3(-1.2, 0, -0.6);

    this.bodiesGroup.addShape(
      wall21.shapes[0],
      wall21Position,
      wall21.quaternion
    );
    // wall22
    const wall22 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.6 * 0.5)
      ),
      mass: 0,
    });

    wall22.quaternion.mult(rotationQuaternion, wall22.quaternion);

    const wall22Position = new CANNON.Vec3(0.25, 0, -0.6);

    this.bodiesGroup.addShape(
      wall22.shapes[0],
      wall22Position,
      wall22.quaternion
    );

    // wall23

    const wall23 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.5 * 0.5)
      ),
      mass: 0,
    });

    const wall23Position = new CANNON.Vec3(0.6, 0, -0.8);

    this.bodiesGroup.addShape(
      wall23.shapes[0],
      wall23Position,
      new CANNON.Quaternion()
    );

    // wall24
    const wall24 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.45 * 0.5)
      ),
      mass: 0,
    });

    wall24.quaternion.mult(rotationQuaternion, wall24.quaternion);

    const wall24Position = new CANNON.Vec3(-2.05, 0, -0);

    this.bodiesGroup.addShape(
      wall24.shapes[0],
      wall24Position,
      wall24.quaternion
    );

    // wall25

    const wall25 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 1.7 * 0.5)
      ),
      mass: 0,
    });

    const wall25Position = new CANNON.Vec3(-1.75, 0, 0.33);

    this.bodiesGroup.addShape(
      wall25.shapes[0],
      wall25Position,
      new CANNON.Quaternion()
    );

    // wall27
    const wall27 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 1.6 * 0.5)
      ),
      mass: 0,
    });

    wall27.quaternion.mult(rotationQuaternion, wall27.quaternion);

    const wall27Position = new CANNON.Vec3(0.29, 0, 0);

    this.bodiesGroup.addShape(
      wall27.shapes[0],
      wall27Position,
      wall27.quaternion
    );

    // wall28

    const wall28 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.55 * 0.5)
      ),
      mass: 0,
    });

    const wall28Position = new CANNON.Vec3(1.15, 0, -0.22);

    this.bodiesGroup.addShape(
      wall28.shapes[0],
      wall28Position,
      new CANNON.Quaternion()
    );

    // //////SHAPE L 29/30
    // wall13

    const wall29 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.5 * 0.5)
      ),
      mass: 0,
    });

    const wall29Position = new CANNON.Vec3(2.3, 0, -0.25);

    this.bodiesGroup.addShape(
      wall29.shapes[0],
      wall29Position,
      new CANNON.Quaternion()
    );

    // wall30
    const wall30 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.4 * 0.5)
      ),
      mass: 0,
    });

    wall30.quaternion.mult(rotationQuaternion, wall30.quaternion);

    const wall30Position = new CANNON.Vec3(2.55, 0, -0);

    this.bodiesGroup.addShape(
      wall30.shapes[0],
      wall30Position,
      wall30.quaternion
    );

    // ////// SHAPE L END

    // wall31
    const wall31 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.4 * 0.5)
      ),
      mass: 0,
    });

    wall31.quaternion.mult(rotationQuaternion, wall31.quaternion);

    const wall31Position = new CANNON.Vec3(-2.6, 0, 0.59);

    this.bodiesGroup.addShape(
      wall31.shapes[0],
      wall31Position,
      wall31.quaternion
    );

    // wall32

    const wall32 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.6 * 0.5)
      ),
      mass: 0,
    });

    const wall32Position = new CANNON.Vec3(-2.3, 0, 0.85);

    this.bodiesGroup.addShape(
      wall32.shapes[0],
      wall32Position,
      new CANNON.Quaternion()
    );
    // wall33

    const wall33 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.6 * 0.5)
      ),
      mass: 0,
    });

    const wall33Position = new CANNON.Vec3(-1.15, 0, 0.35);

    this.bodiesGroup.addShape(
      wall33.shapes[0],
      wall33Position,
      new CANNON.Quaternion()
    );

    // wall34
    const wall34 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 1 * 0.5)
      ),
      mass: 0,
    });

    wall34.quaternion.mult(rotationQuaternion, wall34.quaternion);

    const wall34Position = new CANNON.Vec3(-0.55, 0, 0.6);

    this.bodiesGroup.addShape(
      wall34.shapes[0],
      wall34Position,
      wall34.quaternion
    );

    // wall35

    const wall35 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.6 * 0.5)
      ),
      mass: 0,
    });

    const wall35Position = new CANNON.Vec3(0, 0, 0.35);

    this.bodiesGroup.addShape(
      wall35.shapes[0],
      wall35Position,
      new CANNON.Quaternion()
    );

    // wall36
    const wall36 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 1.65 * 0.5)
      ),
      mass: 0,
    });

    wall36.quaternion.mult(rotationQuaternion, wall36.quaternion);

    const wall36Position = new CANNON.Vec3(1.45, 0, 0.58);

    this.bodiesGroup.addShape(
      wall36.shapes[0],
      wall36Position,
      wall36.quaternion
    );

    ////

    // wall37
    const wall37 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 2.2 * 0.5)
      ),
      mass: 0,
    });

    wall37.quaternion.mult(rotationQuaternion, wall37.quaternion);

    const wall37Position = new CANNON.Vec3(-0.53, 0, 1.15);

    this.bodiesGroup.addShape(
      wall37.shapes[0],
      wall37Position,
      wall37.quaternion
    );

    //

    // wall38

    const wall38 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 1.1 * 0.5)
      ),
      mass: 0,
    });

    const wall38Position = new CANNON.Vec3(0, 0, 1.8);

    this.bodiesGroup.addShape(
      wall38.shapes[0],
      wall38Position,
      new CANNON.Quaternion()
    );
    // wall39

    const wall39 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.5 * 0.5)
      ),
      mass: 0,
    });

    const wall39Position = new CANNON.Vec3(0.6, 0, 1.47);

    this.bodiesGroup.addShape(
      wall39.shapes[0],
      wall39Position,
      new CANNON.Quaternion()
    );
    // wall40

    const wall40 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 1 * 0.5)
      ),
      mass: 0,
    });

    const wall40Position = new CANNON.Vec3(1.1, 0, 1.15);

    this.bodiesGroup.addShape(
      wall40.shapes[0],
      wall40Position,
      new CANNON.Quaternion()
    );
    // wall41

    const wall41 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 1.2 * 0.5)
      ),
      mass: 0,
    });

    const wall41Position = new CANNON.Vec3(2.3, 0, 1.75);

    this.bodiesGroup.addShape(
      wall41.shapes[0],
      wall41Position,
      new CANNON.Quaternion()
    );

    // wall42
    const wall42 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.4 * 0.5)
      ),
      mass: 0,
    });

    wall42.quaternion.mult(rotationQuaternion, wall42.quaternion);

    const wall42Position = new CANNON.Vec3(2.5, 0, 1.2);

    ///
    this.bodiesGroup.addShape(
      wall42.shapes[0],
      wall42Position,
      wall42.quaternion
    );
    // wall43
    const wall43 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 1.65 * 0.5)
      ),
      mass: 0,
    });

    wall43.quaternion.mult(rotationQuaternion, wall43.quaternion);

    const wall43Position = new CANNON.Vec3(-2, 0, 1.75);

    this.bodiesGroup.addShape(
      wall43.shapes[0],
      wall43Position,
      wall43.quaternion
    );
    // wall44

    const wall44 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.6 * 0.5)
      ),
      mass: 0,
    });

    const wall44Position = new CANNON.Vec3(-0.57, 0, 2.05);

    this.bodiesGroup.addShape(
      wall44.shapes[0],
      wall44Position,
      new CANNON.Quaternion()
    );
    // wall45
    const wall45 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.6 * 0.5)
      ),
      mass: 0,
    });

    wall45.quaternion.mult(rotationQuaternion, wall45.quaternion);

    const wall45Position = new CANNON.Vec3(-0.9, 0, 2.3);

    this.bodiesGroup.addShape(
      wall45.shapes[0],
      wall45Position,
      wall45.quaternion
    );

    // wall46

    const wall46 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.45 * 0.5)
      ),
      mass: 0,
    });

    const wall46Position = new CANNON.Vec3(-1.17, 0, 2.6);

    this.bodiesGroup.addShape(
      wall46.shapes[0],
      wall46Position,
      new CANNON.Quaternion()
    );
    // wall47
    const wall47 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.5 * 0.5)
      ),
      mass: 0,
    });

    wall47.quaternion.mult(rotationQuaternion, wall47.quaternion);

    const wall47Position = new CANNON.Vec3(0.3, 0, 2.33);

    this.bodiesGroup.addShape(
      wall47.shapes[0],
      wall47Position,
      wall47.quaternion
    );
    // wall48
    const wall48 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 1.05 * 0.5)
      ),
      mass: 0,
    });

    wall48.quaternion.mult(rotationQuaternion, wall48.quaternion);

    const wall48Position = new CANNON.Vec3(1.7, 0, 2.33);

    this.bodiesGroup.addShape(
      wall48.shapes[0],
      wall48Position,
      wall48.quaternion
    );

    // wall49

    const wall49 = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(wallWidth * 0.5, height * 0.5, 0.45 * 0.5)
      ),
      mass: 0,
    });

    const wall49Position = new CANNON.Vec3(-2.3, 0, 2.6);

    this.bodiesGroup.addShape(
      wall49.shapes[0],
      wall49Position,
      new CANNON.Quaternion()
    );

    // /

    this.physics.world.addBody(this.bodiesGroup);
  }
}
