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
  stars: {
    total: number;
    collected: number;
    items: Item[];
  };

  coins: {
    total: number;
    collected: number;
    items: Item[];
  };
  diamonds: {
    total: number;
    collected: number;
    items: Item[];
  };
  badges: Badge[];
  totalExperience: number;
  earnedExperience: number;
  towerMaxLevel: number;
  canDrive: boolean;
}

export enum ItemTypes {
  COIN = "coin",
  STAR = "star",
  DIAMOND = "diamond",
  TOWER_GAME = "tower_game",
  ACTIONS = "actions",
}

export type ItemTypeCollectable =
  | ItemTypes.COIN
  | ItemTypes.STAR
  | ItemTypes.DIAMOND;

export type ItemTypeAll =
  | ItemTypeCollectable
  | ItemTypes.TOWER_GAME
  | ItemTypes.ACTIONS;

export enum LocalStorageKeys {
  POSITIONS = "POSITIONS",
}

export type LocalStorageTypes = LocalStorageKeys.POSITIONS;

export interface Project {
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
