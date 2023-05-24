import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SourceInt } from "../../sources/base";
import EventEmitter from "./EventEmitter";

interface Loaders {
  gltfLoader: GLTFLoader;
  textureLoader: THREE.TextureLoader;
  cubeTextureLoader: THREE.CubeTextureLoader;
}

type LoaderType = GLTF | THREE.Texture | THREE.CubeTexture;

export interface ResourceItemsInt {
  [key: string]: LoaderType;
}

interface ResourcesInt extends EventEmitter {
  sources: SourceInt[];
  items: ResourceItemsInt;
  toUpload: number;
  uploaded: number;
  loaders: Loaders;
  startLoading: () => void;
  loadSource: (source: SourceInt, file: LoaderType) => void;
}

export default class Resources extends EventEmitter implements ResourcesInt {
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
