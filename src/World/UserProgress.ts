import { Experience } from "../experience/Experience";
import { Item, ItemTypes, ProgressStorage } from "../ts/globalnterfaces";
import { City } from "./models";

const LOCAL_STORAGE = "MAX_R_PARK";

export default class UserProgress {
  experience: Experience;
  city: City;

  collectables: Item[];
  keys: Item[];

  constructor() {
    this.experience = new Experience();
    this.city = this.experience.world.city;

    this.getLocalStorage();
  }

  getLocalStorage() {
    if (localStorage.getItem(LOCAL_STORAGE)) {
      Object.assign(this, JSON.parse(localStorage.getItem(LOCAL_STORAGE)!));

      this.city.onLoadRemoveCollectedItems([
        ...this.collectables,
        ...this.keys,
      ]);
    } else {
      this.collectables = this.city.collectables.map((item) => {
        return {
          name: item.name,
          type: ItemTypes.FRUIT,
          isCollected: false,
        };
      });
      this.keys = this.city.keys.map((item) => {
        return {
          name: item.name,
          type: ItemTypes.KEY,
          isCollected: false,
        };
      });
      this.updateProgress();
    }
  }
  itemCollected(type: string, name: string) {
    switch (type) {
      case ItemTypes.FRUIT:
        this.collectables = this.collectables.map((item) => {
          if (item.name === name) {
            return { ...item, isCollected: true };
          }
          return item;
        });
        break;
      case ItemTypes.KEY:
        this.keys = this.keys.map((item) => {
          if (item.name === name) {
            return { ...item, isCollected: true };
          }
          return item;
        });
        break;

      default:
        break;
    }

    this.updateProgress();
  }

  showCollectedMessage() {}

  updateProgress() {
    const progress: ProgressStorage = {
      collectables: this.collectables,
      keys: this.keys,
    };

    localStorage.setItem(LOCAL_STORAGE, JSON.stringify(progress));
  }
  getResetProgress() {
    localStorage.removeItem(LOCAL_STORAGE);
  }
}
