import EventEmitter from "../../experience/utils/EventEmitter";

export default class Controllers extends EventEmitter {
  buttonWrapper: HTMLDivElement;
  dropButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
  restartButton: HTMLButtonElement;
  constructor() {
    super();
    this.createButtons();
  }

  createButtons() {
    this.buttonWrapper = document.createElement("div");
    this.buttonWrapper.classList.add("controllers-container");

    this.buttonWrapper.innerHTML = /*html*/ `
    <button id="drop" class="control-btn">Drop</button>
    <button id="pause" class="control-btn">Pause</button>
    <button id="restart" class="control-btn">restart</button>
    `;

    document.getElementById("app")?.appendChild(this.buttonWrapper);

    this.setHandlers();
  }
  setHandlers() {
    this.dropButton = document.getElementById("drop") as HTMLButtonElement;
    this.dropButton.addEventListener("click", () =>
      this.trigger("controllerDrop")
    );

    this.pauseButton = document.getElementById("pause") as HTMLButtonElement;
    this.pauseButton.addEventListener("click", () =>
      this.trigger("controllerPause")
    );

    this.restartButton = document.getElementById(
      "restart"
    ) as HTMLButtonElement;

    this.restartButton.addEventListener("click", () =>
      this.trigger("controllerRestart")
    );
  }

  showPlayButtons() {
    this.dropButton.classList.add("show");
    this.pauseButton.classList.add("show");

    this.restartButton.classList.remove("show");
  }

  hidePlayButtons() {
    this.dropButton.classList.remove("show");
    this.pauseButton.classList.remove("show");

    this.restartButton.classList.add("show");
  }
}
