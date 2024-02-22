import * as THREE from "three";

import { BasicPlane } from "../projects/plane/BasicPlane";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { Project } from "../ts/globalTs";
gsap.registerPlugin(Observer);

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.getElementById("canvas-projects")!;

export const setThreeExperience = (data: Project[]) => {
  const scene = new THREE.Scene();
  // CAMERA
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.01,
    100
  );

  camera.position.set(0, 0, 4);

  scene.add(camera);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
  });

  // Sliders

  let parent = new THREE.Group();
  let velocity = 0;

  const slidersArray: BasicPlane[] = [];
  const meshArray: THREE.Mesh[] = [];
  const meshWidth = 4;
  const separationFactor = meshWidth + 0.3;

  let numberOfImages = data.length;

  for (let i = 0; i < numberOfImages; i++) {
    let plane = new BasicPlane({
      width: meshWidth,
      height: 3,
      texture: data[i].texture,
      url: data[i].projectUrl,
    });

    const positionOffset = (i - (numberOfImages - 1) / 2) * separationFactor;

    plane.mesh.position.x = positionOffset;

    slidersArray.push(plane);

    parent.add(plane.mesh);
    meshArray.push(plane.mesh);
  }
  parent.rotation.y = 0.3;
  parent.position.z = -1;
  scene.add(parent);

  /// GSAP

  Observer.create({
    target: window,
    type: "wheel,touch",
    tolerance: 20,
    onChange: (self) => {
      velocity = +(self.velocityY / 10000).toFixed(2);

      slidersArray.forEach((plane) => {
        plane.mesh.position.x -= velocity * 1.1;
        plane.material.uniforms.uVelocity.value = velocity;

        const threshold = ((numberOfImages - 1) * separationFactor) / 2;

        if (plane.mesh.position.x > threshold) {
          plane.mesh.position.x -= numberOfImages * separationFactor;
        } else if (plane.mesh.position.x < -threshold) {
          plane.mesh.position.x += numberOfImages * separationFactor;
        }
      });
    },
  });

  //EVENTS

  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const mousePosition = (event: MouseEvent) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  let clickedImage: THREE.Mesh | null = null;
  let intersects: any[] = [];

  const onClickImage = (event: MouseEvent) => {
    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object as THREE.Mesh;
      if (clickedImage) {
      }
      clickedImage = intersectedMesh;
      window.open(clickedImage.userData.url, "_blank");
    }
  };

  renderer.domElement.addEventListener("click", onClickImage);
  renderer.domElement.addEventListener("mousemove", (event) => {
    mousePosition(event);

    raycaster.setFromCamera(mouse, camera);

    intersects = raycaster.intersectObjects(meshArray);
    if (intersects.length > 0) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }
  });
  const tick = () => {
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();
};
