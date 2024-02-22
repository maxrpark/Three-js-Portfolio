import * as THREE from "three";

const loader = new THREE.TextureLoader();

import { createClient } from "contentful";

const client = createClient({
  space: import.meta.env.VITE_SPACE!,
  environment: "master", // defaults to 'master' if not set
  accessToken: import.meta.env.VITE_ACCESS_TOKEN!,
});

export const getData = () => {
  return client
    .getEntries({ content_type: "projects" })
    .then((data) => {
      const projects = data.items.map((item) => {
        // console.log(item);

        const id = item.sys.id;

        const {
          name,
          shortDsc,
          longDsc,
          pageUrl,
          gitUrl,
          tags,
          version,
          image,
          projectID,
          featured,
          video,
        } = item.fields;

        //@ts-ignore
        const url = image?.fields?.file?.url;

        const texture = loader.load(url);

        return {
          video,
          projectID,
          name,
          shortDsc,
          longDsc,
          pageUrl,
          gitUrl,
          tags,
          version,
          url,
          texture,
          id,
          featured,
        };
      });

      // const projects = data
      //   .filter((project: Project) => project.featured === true)
      //   .map((el: Project) => {
      //     return { ...el, texture: loader.load(el.url) };
      //   });

      return projects;
    })
    .catch(console.error);
};
