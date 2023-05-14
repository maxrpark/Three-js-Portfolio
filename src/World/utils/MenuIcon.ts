import EventEmitter from "../../experience/utils/EventEmitter";
export default class MenuIcon extends EventEmitter {
  private menuIconElem: HTMLDivElement;
  constructor() {
    super();
    this.createElement();
  }

  createElement() {
    this.menuIconElem = document.createElement("div");
    this.menuIconElem.classList.add("menu-icon");

    // menu icons line
    const innerLine = document.createElement("span");
    innerLine.classList.add("inner-line");
    this.menuIconElem.appendChild(innerLine);

    document.getElementById("app")?.appendChild(this.menuIconElem);

    this.menuIconElem.addEventListener("click", () =>
      this.trigger("handleMenuClick")
    );
  }
}
