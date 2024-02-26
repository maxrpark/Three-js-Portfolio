import * as THREE from "three";

const loader = new THREE.TextureLoader();

import { createClient } from "contentful";

const client = createClient({
  space: import.meta.env.VITE_SPACE!,
  environment: "master", // defaults to 'master' if not set
  accessToken: import.meta.env.VITE_ACCESS_TOKEN!,
});

export const getAllProjects = () => {
  return client
    .getEntries({ content_type: "projects" })
    .then((data) => {
      const projects = data.items.map((item) => {
        // console.log(item);

        const id = item.sys.id;

        const {
          name,
          // shortDsc,
          longDsc,
          // projectUrl,
          // gitUrl,
          // tags,
          version,
          image,
          // featured,
          // video,
        } = item.fields;

        //@ts-ignore
        const url = image?.fields?.file?.url;

        const texture = loader.load(url);

        return {
          // video,
          name,
          // shortDsc,
          longDsc,
          // projectUrl,
          // gitUrl,
          // tags,
          version,
          url,
          texture,
          id,
          // featured,
        };
      });

      return projects;
    })
    .catch(console.error);
};
export const getSingleProject = (id: string) => {
  return client
    .getEntry(id)
    .then((item) => {
      const {
        name,
        shortDsc,
        longDsc,
        projectUrl,
        gitUrl,
        tags,
        version,
        image,
        featured,
        video,
      } = item.fields;

      //@ts-ignore
      const url = image?.fields?.file?.url;

      return {
        video,
        name,
        shortDsc,
        longDsc,
        projectUrl,
        gitUrl,
        tags,
        version,
        url,
        id,
        featured,
      };
    })
    .catch(console.error);
};
