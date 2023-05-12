import EventEmitter from "../../experience/utils/EventEmitter";

export default class MenuIcon extends EventEmitter {
  private menuIconElem: HTMLDivElement;
  public displayElem: "none" | "flex" = "flex";
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

    // this.display(this.displayElem);
    document.getElementById("app")?.appendChild(this.menuIconElem);

    this.menuIconElem.addEventListener("click", () =>
      this.trigger("handleMenuClick")
    );
  }

  public display(type: "none" | "flex" = "none") {
    this.menuIconElem.style.display = type;
  }

  classAdd(className: string) {
    this.menuIconElem.classList.toggle(className);
  }
  classRemove(className: string) {
    this.menuIconElem.classList.toggle(className);
  }
}
