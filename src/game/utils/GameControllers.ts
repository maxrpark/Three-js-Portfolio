import EventEmitter from "../../experience/utils/EventEmitter";

export default class Controllers extends EventEmitter {
  private buttonWrapper: HTMLDivElement;
  private dropButton: HTMLButtonElement;
  private menuButton: HTMLButtonElement;
  constructor() {
    super();
    this.createButtons();
  }

  private createButtons() {
    this.buttonWrapper = document.createElement("div");
    this.buttonWrapper.classList.add("controllers-container");

    this.buttonWrapper.innerHTML = /*html*/ `
   <button id="menu" class="control-btn btn-primary">
    <span class="inner-line"></span>
   </button>
    <button id="drop" class="control-btn btn-primary">Drop</button>
    `;

    document.getElementById("app")?.appendChild(this.buttonWrapper);

    this.setHandlers();
  }
  private setHandlers() {
    this.dropButton = document.getElementById("drop") as HTMLButtonElement;
    this.dropButton.addEventListener("click", () =>
      this.trigger("controllerDrop")
    );

    this.menuButton = document.getElementById("menu") as HTMLButtonElement;
    this.menuButton.addEventListener("click", () => {
      this.trigger("controllerMenu");
    });
  }

  public showPlayButtons() {
    this.dropButton.classList.add("show");
    this.menuButton.classList.add("show");
  }
  public showPlayMenu() {
    this.menuButton.classList.add("show");
  }

  public hidePlayButtons() {
    this.dropButton.classList.remove("show");
    // this.menuButton.classList.remove("show");
  }
}
