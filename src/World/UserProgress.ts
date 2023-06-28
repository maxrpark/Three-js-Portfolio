import { Experience } from "../experience/Experience";
import { Item, ItemTypes, ProgressStorage } from "../ts/globalnterfaces";
import { City } from "./models";
import ToastNotification from "./utils/ToastNotification";

const LOCAL_STORAGE = "MAX_R_PARK";

export default class UserProgress {
  experience: Experience;
  city: City;
  toastNotification: ToastNotification;

  fruits: {
    total: number;
    collected: number;
    items: Item[];
    title: string;
    text: string;
  };

  keys: {
    total: number;
    collected: number;
    items: Item[];
    title: string;
    text: string;
  };
  numberOfCollectables: number;
  numberOfKeys: number;

  constructor() {
    this.experience = new Experience();
    this.city = this.experience.world.city;
    this.toastNotification = this.experience.world.toastNotification;

    this.fruits = {
      total: 0,
      collected: 0,
      items: [],
      title: "Fruit Collector",
      text: "Well done you have a collected a new fruit",
    };
    this.keys = {
      total: 0,
      collected: 0,
      items: [],
      title: "Key Collector",
      text: "Well done you have a collected a new key",
    };

    this.getLocalStorage();
  }

  getLocalStorage() {
    if (localStorage.getItem(LOCAL_STORAGE)) {
      Object.assign(this, JSON.parse(localStorage.getItem(LOCAL_STORAGE)!));

      this.city.onLoadRemoveCollectedItems([
        ...this.fruits.items,
        ...this.keys.items,
      ]);
    } else {
      this.fruits.total = this.city.collectables.length;
      this.fruits.items = this.city.collectables.map((item) => {
        return {
          name: item.name,
          type: ItemTypes.FRUIT,
          isCollected: false,
        };
      });
      this.keys.total = this.city.keys.length;
      this.keys.items = this.city.keys.map((item) => {
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
        this.fruits.items = this.fruits.items.map((item) => {
          if (item.name === name) {
            ++this.fruits.collected;
            return { ...item, isCollected: true };
          }
          return item;
        });

        this.toastNotification.showToast({
          title: `${this.fruits.title} ${this.fruits.collected} out of ${this.fruits.total}`,
          text: this.fruits.text,
        });

        break;
      case ItemTypes.KEY:
        this.keys.items = this.keys.items.map((item) => {
          if (item.name === name) {
            ++this.keys.collected;
            return { ...item, isCollected: true };
          }
          return item;
        });
        this.toastNotification.showToast({
          title: `${this.keys.title} ${this.keys.collected} out of ${this.keys.total}`,
          text: this.keys.text,
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
      fruits: this.fruits,
      keys: this.keys,
    };

    localStorage.setItem(LOCAL_STORAGE, JSON.stringify(progress));
  }
  getResetProgress() {
    localStorage.removeItem(LOCAL_STORAGE);
  }
}
