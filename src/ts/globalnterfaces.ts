export interface MeshTextureInt {
  color?: any;
  map?: any;
  normalMap?: any;
  aoMap?: any;
  aoMapIntensity?: any;
  roughnessMap?: any;
  metalnessMap?: any;
  displacementMap?: any;
  displacementScale?: any;
  roughness?: number;
  metalness?: number;
  matcap?: any;
}

export interface Item {
  name: string;
  type: ItemType;
  isCollected: boolean;
}

export interface ProgressStorage {
  collectables: Item[];
  keys: Item[];
}

export enum ItemTypes {
  FRUIT = "fruit",
  KEY = "key",
}

export type ItemType = ItemTypes.FRUIT | ItemTypes.KEY;
