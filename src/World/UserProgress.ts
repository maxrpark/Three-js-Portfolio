import { Experience } from "../experience/Experience";
import {
  Item,
  ItemType,
  ItemTypes,
  ProgressStorage,
} from "../ts/globalnterfaces";
import { City } from "./models";
import ToastNotification from "./utils/ToastNotification";

const LOCAL_STORAGE = "MAX_R_PARK";

const badges = [
  {
    id: 1,
    src: "",
    isCollected: false,
    name: "Urban Wanderer",
    text: "Take a walk around the city", /// Walk around the city first time
    experience: 5, // something
    typeCollection: false,
    totalToCollect: 0,
    hasCollected: 0,
    type: "tower",
  },
  {
    id: 2,
    src: "",
    isCollected: false,
    name: "Skyward Adventurer", // Play tower stack first time
    experience: 5,
    text: "Explanation", // something
    typeCollection: false,
    totalToCollect: 0,
    hasCollected: 0,
    type: "explorer",
  },
  {
    id: 3,
    src: "",
    isCollected: false,
    name: "Treasure Hunter", // Collect one item
    experience: 5,
    text: "Explanation", // something
    typeCollection: true,
    totalToCollect: 1,
    hasCollected: 0,
    type: ItemTypes.FRUIT,
  },
  {
    id: 4,
    src: "",
    isCollected: false,
    name: "Collect them all", // collect all 5 items
    experience: 5,
    text: "Explanation",
    typeCollection: true, // something
    totalToCollect: 4,
    hasCollected: 0,
    type: ItemTypes.FRUIT,
  },
  {
    id: 5,
    src: "",
    isCollected: false,
    name: "Key Hunter", // Collect one key
    experience: 5,
    text: "Explanation", // something
    typeCollection: true,
    totalToCollect: 1,
    hasCollected: 0,
    type: ItemTypes.KEY,
  },
  {
    id: 6,
    src: "",
    isCollected: false,
    name: "The lord of the keys", // collect all 3 keys
    experience: 5,
    text: "Explanation", // something
    typeCollection: true,
    totalToCollect: 3,
    hasCollected: 0,
    type: ItemTypes.KEY,
  },
  //// REPETIDO
  {
    id: 7,
    src: "",
    isCollected: false,
    name: "Collect them all", // collect all 5 items
    experience: 5,
    text: "Explanation",
    typeCollection: true, // something
    totalToCollect: 5,
    hasCollected: 0,
    type: ItemTypes.FRUIT,
  },
  {
    id: 8,
    src: "",
    isCollected: false,
    name: "Key Hunter", // Collect one key
    experience: 5,
    text: "Explanation", // something
    typeCollection: true,
    totalToCollect: 1,
    hasCollected: 0,
    type: ItemTypes.KEY,
  },
  {
    id: 9,
    src: "",
    isCollected: false,
    name: "The lord of the keys", // collect all 3 keys
    experience: 5,
    text: "Explanation", // something
    typeCollection: true,
    totalToCollect: 3,
    hasCollected: 0,
    type: ItemTypes.KEY,
  },
];

export interface Collectables {
  total: number;
  collected: number;
  items: Item[];
}

export default class UserProgress {
  experience: Experience;
  city: City;
  toastNotification: ToastNotification;

  badges: any;

  fruits: Collectables;

  keys: Collectables;
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
    };
    this.keys = {
      total: 0,
      collected: 0,
      items: [],
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
      this.badges = badges;
      this.updateProgress();
    }
  }

  updateItemCollection(items: Item[], name: string) {
    return items.map((item) => {
      if (item.name === name) {
        item.isCollected = true;
      }
      return item;
    });
  }
  itemCollected(type: ItemType, name: string) {
    let collectedItem = {} as Collectables;
    switch (type) {
      case ItemTypes.FRUIT:
        this.fruits.items = this.updateItemCollection(this.fruits.items, name);
        this.fruits.collected++;
        collectedItem = this.fruits;

        break;

      case ItemTypes.KEY:
        this.keys.items = this.updateItemCollection(this.keys.items, name);
        this.keys.collected++;
        collectedItem = this.keys;
        break;

      default:
        break;
    }

    this.checkCollectableItemsBadges(
      type,
      collectedItem.collected,
      collectedItem.total
    );
    this.updateProgress();
  }

  checkCollectableItemsBadges(
    type: ItemType,
    collected: number,
    total: number
  ) {
    let hasEarnABadge = false;
    let earnedBadge = {};
    this.badges = this.badges.map((badge: any) => {
      let { totalToCollect, hasCollected } = badge;

      if (badge.type !== type || totalToCollect === hasCollected) {
        return badge;
      }

      ++hasCollected;

      if (totalToCollect === hasCollected) {
        badge.isCollected = true;
        hasEarnABadge = true;

        earnedBadge = badge;
      }

      return {
        ...badge,
        hasCollected,
      };
    });
    if (hasEarnABadge) {
      this.showCompletedBadgeNotification(earnedBadge);
    }
    {
      this.toastNotification.showToast({
        title: `${type}. `,
        text: `You had collected ${collected} out of ${total}`,
        className: `explore-toast`,
      });
    }
  }

  showCompletedBadgeNotification(badge: any) {
    this.toastNotification.showToast({
      title: `${badge.name}. ${badge.hasCollected} out of ${badge.totalToCollect}`,
      text: badge.text,
      className: "completed",
    });
  }

  updateProgress() {
    const progress: ProgressStorage = {
      fruits: this.fruits,
      keys: this.keys,
      badges: this.badges,
    };

    localStorage.setItem(LOCAL_STORAGE, JSON.stringify(progress));
  }
  resetProgress() {
    localStorage.removeItem(LOCAL_STORAGE);
    window.location.reload();
  }
}
