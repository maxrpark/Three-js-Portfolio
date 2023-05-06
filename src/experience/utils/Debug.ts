import GUI from "lil-gui";

export default class Debug {
  active: boolean;
  ui: GUI;
  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.ui = new GUI();
      this.active = true;
      return;
    }
  }
}
