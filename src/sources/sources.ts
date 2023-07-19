export interface SourceInt {
  type: "cubeTextureLoader" | "textureLoader" | "gltfLoader" | "rgbeLoader";
  name: string;
  path: string & string[];
}

export default [
  {
    name: "environmentMapTexture",
    type: "rgbeLoader",
    path: "textures/environmentMap/hdr_1.hdr",
  },
  {
    name: "city",
    type: "gltfLoader",
    path: "models/city/city.glb",
  },
  {
    name: "Car",
    type: "gltfLoader",
    path: "models/vehicle/vehicle.glb",
  },

  {
    name: "towerFloorColor",
    type: "textureLoader",
    path: "textures/brick-wall/color.jpg",
  },
  // {
  //   name: "towerFloorNormal",
  //   type: "textureLoader",
  //   path: "textures/brick-wall/normal.jpg",
  // },
  // {
  //   name: "towerFloorHeight",
  //   type: "textureLoader",
  //   path: "textures/brick-wall/height.png",
  // },
  // {
  //   name: "towerFloorAOM",
  //   type: "textureLoader",
  //   path: "textures/brick-wall/aom.jpg",
  // },
  // {
  //   name: "towerFloorRoughness",
  //   type: "textureLoader",
  //   path: "textures/brick-wall/roughness.jpg",
  // },
  {
    name: "male_character_1",
    type: "gltfLoader",
    path: "models/character/character.glb",
  },
] as SourceInt[];
