import "./static/styles/projects.css";

import * as THREE from "three";

import { BasicPlane } from "./projects/plane/BasicPlane";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import axios from "axios";
const loader = new THREE.TextureLoader();

gsap.registerPlugin(Observer);
const canvas = document.createElement("canvas");

document.querySelector("#app")?.appendChild(canvas);

const getData = async () => {
  const res = await axios(
    "https://my-portfolio-blog-website.netlify.app/api/myProjects"
  );
  const data = await res.data;
  const projects = data
    .filter((project: any) => project.featured === true)
    .map((el: any) => {
      return { ...el, texture: loader.load(el.url) };
    });

  return projects;
};

const data = await getData();

// sizes

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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

// Object

let parent = new THREE.Group();
const slidersArray: BasicPlane[] = [];
const meshArray: THREE.Mesh[] = [];
const meshWidth = 4;
const separationFactor = meshWidth + 0.3;
const numberOfImages = data.length;

for (let i = 0; i < numberOfImages; i++) {
  let plane = new BasicPlane({
    width: meshWidth,
    height: 3,
    texture: data[i].texture,
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

/// GSAP

let velocity = 0;

Observer.create({
  target: window,
  type: "wheel,touch",
  onChange: (self) => {
    velocity = +(self.velocityY / 10000).toFixed(2);

    slidersArray.forEach((plane) => {
      plane.material.uniforms.uVelocity.value = velocity;
      plane.mesh.position.x -= velocity * 1.1;

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

const onClickImage = (event: MouseEvent) => {
  mousePosition(event);

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(meshArray);

  if (intersects.length > 0) {
    const intersectedMesh = intersects[0].object as THREE.Mesh;
    if (clickedImage) {
    }
    clickedImage = intersectedMesh;

    console.log(clickedImage);
  }
};

renderer.domElement.addEventListener("click", onClickImage);
const maxDistance = 3;
const clock = new THREE.Clock();
const tick = () => {
  const elapse = clock.getElapsedTime();
  renderer.render(scene, camera);

  slidersArray.forEach((plane) => {
    plane.update(elapse);

    plane.material.uniforms.uVelocity.value = velocity;

    const distance = Math.abs(0 - plane.mesh.position.x);

    // const t = 1.0 - Math.min(distance / maxDistance, 1.0);

    // plane.mesh.position.z = THREE.MathUtils.lerp(0, 0.5, t);
  });

  window.requestAnimationFrame(tick);
};

tick();
