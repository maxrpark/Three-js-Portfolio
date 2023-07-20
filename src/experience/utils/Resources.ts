import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { SourceInt } from "../../sources/sources";
import EventEmitter from "./EventEmitter";

interface Loaders {
  gltfLoader: GLTFLoader;
  textureLoader: THREE.TextureLoader;
  cubeTextureLoader: THREE.CubeTextureLoader;
  rgbeLoader: RGBELoader;
}

type LoaderType = GLTF | THREE.Texture | THREE.CubeTexture;

export interface ResourceItemsInt {
  [key: string]: LoaderType;
}

export default class Resources extends EventEmitter {
  sources: SourceInt[];
  items: ResourceItemsInt;
  toUpload: number;
  uploaded: number;
  loaders: Loaders;
  constructor(sources: SourceInt[]) {
    super();

    this.sources = sources;
    this.toUpload = this.sources.length;
    this.uploaded = 0;
    this.items = {};

    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
      rgbeLoader: new RGBELoader(),
    };

    this.startLoading();
  }
  startLoading() {
    for (const source of this.sources) {
      this.loaders[source.type].load(source.path, (file) => {
        this.loadSource(source, file);
      });
    }
  }
  loadSource(source: SourceInt, file: LoaderType) {
    this.items[source.name] = file;

    this.uploaded++;

    this.trigger("itemLoaded");

    if (this.uploaded === this.toUpload) {
      this.trigger("loaded");
    }
  }
}
