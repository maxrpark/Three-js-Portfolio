import EventEmitter from "./EventEmitter";
export interface SizesInt extends EventEmitter {
  width: number;
  height: number;
  pixelRatio: number;
}

export class Sizes extends EventEmitter implements SizesInt {
  width: number;
  height: number;
  pixelRatio: number;
  constructor() {
    super();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.trigger("resize");
    });
  }
}
