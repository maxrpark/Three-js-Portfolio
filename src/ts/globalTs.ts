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
export interface Badge {
  id: number;
  src: string;
  isCollected: boolean;
  name: string; // collect all 3 keys
  experience: number;
  text: string; // something
  typeCollection: boolean;
  totalToCollect: number;
  hasCollected: number;
  type: ItemTypeAll;
}

export interface Item {
  name: string;
  type: ItemTypeCollectable;
  isCollected: boolean;
}

export interface ProgressStorage {
  fruits: {
    total: number;
    collected: number;
    items: Item[];
  };

  keys: {
    total: number;
    collected: number;
    items: Item[];
  };
  badges: any;
  totalExperience: number;
  earnedExperience: number;
  maxTowerLevel: number;
}

export enum ItemTypes {
  FRUIT = "fruit",
  KEY = "key",
  TOWER_GAME = "tower_game",
  ACTIONS = "actions",
}

export type ItemTypeCollectable = ItemTypes.FRUIT | ItemTypes.KEY;

export type ItemTypeAll =
  | ItemTypeCollectable
  | ItemTypes.TOWER_GAME
  | ItemTypes.ACTIONS;

export enum LocalStorageKeys {
  POSITIONS = "POSITIONS",
}

export type LocalStorageTypes = LocalStorageKeys.POSITIONS;
