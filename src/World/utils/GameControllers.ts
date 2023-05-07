import EventEmitter from "../../experience/utils/EventEmitter";

export default class Controllers extends EventEmitter {
  buttonWrapper: HTMLDivElement;
  dropButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
  constructor() {
    super();
    this.createButtons();
    this.drop = this.drop.bind(this);
    this.pause = this.pause.bind(this);
  }

  createButtons() {
    this.buttonWrapper = document.createElement("div");
    this.buttonWrapper.classList.add("controllers-container");

    this.buttonWrapper.innerHTML = /*html*/ `
    <button id="drop" class="control-btn">Drop</button>
    <button id="pause" class="control-btn">Pause</button>
    `;

    document.getElementById("app")?.appendChild(this.buttonWrapper);

    this.setHandlers();
  }
  setHandlers() {
    this.dropButton = document.getElementById("drop") as HTMLButtonElement;
    this.dropButton.addEventListener("click", this.drop.bind(this));

    this.pauseButton = document.getElementById("pause") as HTMLButtonElement;
    this.pauseButton.addEventListener("click", this.pause.bind(this));
  }
  drop() {
    this.trigger("controllerDrop");
  }
  pause() {
    this.trigger("controllerPause");
  }
  hide() {
    console.log("hello");
    this.buttonWrapper.classList.remove("show");
  }
  show() {
    this.buttonWrapper.classList.add("show");
  }
}
