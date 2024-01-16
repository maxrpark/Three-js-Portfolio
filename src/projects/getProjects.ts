import axios from "axios";
import { Project } from "../ts/globalTs";
import * as THREE from "three";

const loader = new THREE.TextureLoader();

export const getData = () => {
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
