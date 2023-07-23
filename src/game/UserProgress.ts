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

const LOCAL_STORAGE = "MAX_R_PARK";

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

  coins: Collectables;
  diamonds: Collectables;
  stars: Collectables;

  numberOfCollectables: number;
  numberOfKeys: number;
  canDrive: boolean;

  ///

  towerMaxLevel: number;

  constructor() {
    this.experience = new Experience();
    this.city = this.experience.world.city;
    this.toastNotification = this.experience.world.toastNotification;
    this.towerMaxLevel = 0;

    this.coins = {
      total: 0,
      collected: 0,
      items: [],
    };
    this.stars = {
      total: 0,
      collected: 0,
      items: [],
    };
    this.diamonds = {
      total: 0,
      collected: 0,
      items: [],
    };

    this.getLocalStorage();
    if (this.canDrive) this.city.removeBody();
  }

  getLocalStorage() {
    if (localStorage.getItem(LOCAL_STORAGE)) {
      Object.assign(this, JSON.parse(localStorage.getItem(LOCAL_STORAGE)!));

      this.city.onLoadRemoveCollectedItems([
        ...this.coins.items,
        ...this.diamonds.items,
        ...this.stars.items,
      ]);
    } else {
      localStorage.clear();
      this.stars.total = this.city.stars.length;
      this.stars.items = this.city.stars.map((item) => {
        return {
          name: item.name,
          type: ItemTypes.STAR,
          isCollected: false,
        };
      });
      this.coins.total = this.city.coins.length;
      this.coins.items = this.city.coins.map((item) => {
        return {
          name: item.name,
          type: ItemTypes.COIN,
          isCollected: false,
        };
      });
      this.diamonds.total = this.city.diamonds.length;
      this.diamonds.items = this.city.diamonds.map((item) => {
        return {
          name: item.name,
          type: ItemTypes.COIN,
          isCollected: false,
        };
      });
      this.badges = badges;
      this.totalExperience = this.badges.reduce(
        (acc: number, current: Badge) => {
          return acc + current.experience;
        },
        0
      );

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
      case ItemTypes.STAR:
        this.stars.items = this.updateItemCollection(this.stars.items, name);
        this.stars.collected++;
        collectedItem = this.stars;

        break;

      case ItemTypes.DIAMOND:
        this.diamonds.items = this.updateItemCollection(
          this.diamonds.items,
          name
        );
        this.diamonds.collected++;
        collectedItem = this.diamonds;

        break;

      case ItemTypes.COIN:
        this.coins.items = this.updateItemCollection(this.coins.items, name);
        this.coins.collected++;

        if (this.coins.collected === this.coins.total) {
          this.experience.world.exploringWorld.userCanDrive();
          this.canDrive = true;
          this.city.removeBody();
        }

        collectedItem = this.coins;
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
        title: `${type.toLocaleUpperCase()} collector. `,
        text: `You had collected ${collected} out of ${total} ${type}s`,
        className: `explore-toast`,
        image: "",
      });
    }
  }

  checkTowerBadges(towerLevel: number) {
    this.badges = this.badges.map((badge) => {
      if (badge.type !== ItemTypes.TOWER_GAME || badge.isCollected) {
        return badge;
      }

      this.towerMaxLevel = Math.max(this.towerMaxLevel, towerLevel);
      badge.hasCollected = this.towerMaxLevel;

      if (badge.totalToCollect === badge.hasCollected) {
        badge.isCollected = true;
        this.earnedExperience += badge.experience;
        badge.hasCollected = this.towerMaxLevel;
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
      image: badge.src,
    });
  }

  updateProgress() {
    const progress: ProgressStorage = {
      stars: this.stars,
      coins: this.coins,
      diamonds: this.diamonds,
      badges: this.badges,
      totalExperience: this.totalExperience,
      earnedExperience: this.earnedExperience,
      towerMaxLevel: this.towerMaxLevel,
      canDrive: this.canDrive,
    };

    localStorage.setItem(LOCAL_STORAGE, JSON.stringify(progress));
  }
  resetProgress() {
    localStorage.clear();
    window.location.reload();
  }
}
