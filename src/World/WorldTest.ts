import { StandardBlock, BlockInt } from "../blocks/StandardBlock";
import { Group } from "three";
import { Experience, ExperienceInt } from "../experience/Experience";
import { Environment } from "./Environment";

import Resources from "../experience/utils/Resources";
import sources from "../sources/base";

export class World {
  block: BlockInt;
  world: Group;
  experience: ExperienceInt;
  environment: Environment;
  resources: Resources;
  textures: any;
  constructor() {
    this.experience = new Experience();

    this.world = new Group();
    this.resources = new Resources(sources);

    this.textures = {};

    this.resources.on("loaded", () => {
      this.environment = new Environment({
        environmentMapTexture: this.resources.items.environmentMapTexture,
        hasAmbientLight: true,
        hasDirectionalLight: true,
      });

      this.block = new StandardBlock({
        textures: {
          color: this.resources.items.grassColorTexture,
          normal: this.resources.items.grassNormalTexture,
        },
      });

      this.world.add(this.block.mesh);
    });

    this.experience.scene.add(this.world);
  }
}
