import "./static/styles/projects.css";

import * as THREE from "three";

import { BasicPlane } from "./projects/plane/BasicPlane";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import axios from "axios";
gsap.registerPlugin(Observer);
interface Project {
  id: string;
  name: string;
  shortDsc: string;
  texture: THREE.Texture;
  featured: boolean;
  url: string;
  version: string;
  pageUrl: string;
  gitUrl: string;
}

const loader = new THREE.TextureLoader();

const canvas = document.getElementById("canvas-projects")!;

const projectsSection = document.querySelector(".projects")!;

const projectsMobile = (data: Project[]) => {
  const projects = data
    .map(function (project) {
      return ` 
        <article data-id"${project.id}" class="single-project id">
          <div class="project-info">
          <div class="img-container">
            <img class="project-img img" src="${project.url}" alt="${project.name}" />
            </div>
            <div class="project-description">
              <h4 class="">${project.version}</h4>
              <h2 class="project-name">${project.name}</h2>
              </div>
            </div>
          </div>
          <div class="project-links">
            <a href="${project.gitUrl}" target="_blank"
              ><i class="fab fa-github"></i></a>
          
              <a class=" btn project-btn" href="${project.pageUrl}" target="_blank">visit</a>
            
          </div>
        </article>
       `;
    })
    .join("");
  projectsSection.innerHTML = projects;
};

const getData = () => {
  return axios("https://my-portfolio-blog-website.netlify.app/api/myProjects")
    .then((res) => res.data)
    .then((data) => {
      const projects = data
        .filter((project: Project) => project.featured === true)
        .map((el: Project) => {
          return { ...el, texture: loader.load(el.url) };
        });

      return projects;
    });
};

let data;
let parent = new THREE.Group();
let velocity = 0;

const slidersArray: BasicPlane[] = [];
const meshArray: THREE.Mesh[] = [];
const meshWidth = 4;
const separationFactor = meshWidth + 0.3;
getData().then((result) => {
  data = result;

  // Object

  projectsMobile(data);

  let numberOfImages = data.length;

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
});

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
// const clock = new THREE.Clock();
const tick = () => {
  // const elapse = clock.getElapsedTime();
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
