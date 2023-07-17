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
  // {
  //   name: "environmentMapTexture",
  //   type: "cubeTextureLoader",
  //   path: [
  //     "textures/environmentMap/px.jpg",
  //     "textures/environmentMap/nx.jpg",
  //     "textures/environmentMap/py.jpg",
  //     "textures/environmentMap/ny.jpg",
  //     "textures/environmentMap/pz.jpg",
  //     "textures/environmentMap/nz.jpg",
  //   ],
  // },
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
    name: "concreteColor",
    type: "textureLoader",
    path: "textures/concrete/color.jpg",
  },
  {
    name: "concreteNormal",
    type: "textureLoader",
    path: "textures/concrete/normal.jpg",
  },
  {
    name: "concreteHeight",
    type: "textureLoader",
    path: "textures/concrete/height.png",
  },
  {
    name: "concreteAOM",
    type: "textureLoader",
    path: "textures/concrete/aom.jpg",
  },
  {
    name: "concreteRoughness",
    type: "textureLoader",
    path: "textures/concrete/roughness.jpg",
  },
  {
    name: "towerFloorColor",
    type: "textureLoader",
    path: "textures/brick-wall/color.jpg",
  },
  {
    name: "towerFloorNormal",
    type: "textureLoader",
    path: "textures/brick-wall/normal.jpg",
  },
  {
    name: "towerFloorHeight",
    type: "textureLoader",
    path: "textures/brick-wall/height.png",
  },
  {
    name: "towerFloorAOM",
    type: "textureLoader",
    path: "textures/brick-wall/aom.jpg",
  },
  {
    name: "towerFloorRoughness",
    type: "textureLoader",
    path: "textures/brick-wall/roughness.jpg",
  },
  {
    name: "mapCapText",
    type: "textureLoader",
    path: "textures/mapCaps/4.png",
  },
  {
    name: "male_character",
    type: "gltfLoader",
    path: "models/character/scene.gltf",
  },
  {
    name: "male_character_1",
    type: "gltfLoader",
    path: "models/character_1/character.glb",
  },
] as SourceInt[];
