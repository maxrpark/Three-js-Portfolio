import { Experience } from "../experience/Experience";
import {
  Badge,
  Item,
  ItemTypeCollectable,
  ItemTypes,
  ProgressStorage,
} from "../ts/globalTs";
import ExploringWorld from "./ExploringWorld";
import badges from "./badgesData";
import { City } from "./models";
import ToastNotification from "./utils/ToastNotification";

const LOCAL_STORAGE = "MAX_R_PARK_1";

export interface Collectables {
  total: number;
  collected: number;
  items: Item[];
}

export default class UserProgress {
  experience: Experience;
  city: City;
  toastNotification: ToastNotification;
  exploringWorld: ExploringWorld;

  badges: Badge[];
  totalExperience: number;
  earnedExperience: number;

  fruits: Collectables;

  keys: Collectables;
  numberOfCollectables: number;
  numberOfKeys: number;
  canDrive: boolean;

  ///

  towerMaxLevel: number;

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
    // localStorage.removeItem("MAX_R_PARK");
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
      this.totalExperience = this.badges.reduce((acc: number, current: any) => {
        return acc + current.experience;
      }, 0);

      this.towerMaxLevel = 0;
      this.earnedExperience = 0;
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
  itemCollected(type: ItemTypeCollectable, name: string) {
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

        if (this.keys.collected === this.keys.total) {
          this.experience.world.exploringWorld.userCanDrive();
          this.canDrive = true;
        }

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
    type: ItemTypeCollectable,
    collected: number,
    total: number
  ) {
    let hasEarnABadge = false;
    let earnedBadge = {} as Badge;
    this.badges = this.badges.map((badge: Badge) => {
      let { totalToCollect, hasCollected } = badge;

      if (badge.type !== type || totalToCollect === hasCollected) {
        return badge;
      }

      ++hasCollected;

      if (totalToCollect === hasCollected) {
        badge.isCollected = true;
        hasEarnABadge = true;
        this.earnedExperience += badge.experience;
        earnedBadge = badge;
      }

      return {
        ...badge,
        hasCollected,
      };
    });

    if (hasEarnABadge) {
      this.showCompletedBadgeNotification(earnedBadge);
    } else {
      this.toastNotification.showToast({
        title: `${type}. `,
        text: `You had collected ${collected} out of ${total}`,
        className: `explore-toast`,
      });
    }
  }

  // Tower

  checkTowerBadges(towerLevel: number) {
    this.badges = this.badges.map((badge) => {
      if (badge.type !== ItemTypes.TOWER_GAME || badge.isCollected) {
        return badge;
      }

      if (this.towerMaxLevel < towerLevel) {
        this.towerMaxLevel = towerLevel;
        badge.hasCollected = this.towerMaxLevel;
      }
      if (badge.totalToCollect === badge.hasCollected) {
        badge.isCollected = true;
        this.earnedExperience += badge.experience;
        this.showCompletedBadgeNotification(badge);
      }

      return badge;
    });

    this.updateProgress();
  }

  checkBadgesByID(id: number) {
    this.badges = this.badges.map((badge) => {
      if (badge.id === id && !badge.isCollected) {
        badge.isCollected = true;
        this.earnedExperience += badge.experience;
        this.showCompletedBadgeNotification(badge);
      }

      return badge;
    });

    this.updateProgress();
  }

  //
  showCompletedBadgeNotification(badge: Badge) {
    this.toastNotification.showToast({
      title: `${badge.name}. Earned ${badge.experience}XP`,
      text: badge.text,
      className: "completed",
    });
  }

  updateProgress() {
    const progress: ProgressStorage = {
      fruits: this.fruits,
      keys: this.keys,
      badges: this.badges,
      totalExperience: this.totalExperience,
      earnedExperience: this.earnedExperience,
      maxTowerLevel: this.towerMaxLevel,
      canDrive: this.canDrive,
    };

    localStorage.setItem(LOCAL_STORAGE, JSON.stringify(progress));
  }
  resetProgress() {
    localStorage.clear();
    window.location.reload();
  }
}
