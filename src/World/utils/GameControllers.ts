import EventEmitter from "../../experience/utils/EventEmitter";

export default class Controllers extends EventEmitter {
  buttonWrapper: HTMLDivElement;
  dropButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
  playButton: HTMLButtonElement;
  constructor() {
    super();
    this.createButtons();
  }

  createButtons() {
    this.buttonWrapper = document.createElement("div");
    this.buttonWrapper.classList.add("controllers-container");

    this.buttonWrapper.innerHTML = /*html*/ `
    <button id="pause" class="control-btn">Pause</button>
    <button id="drop" class="control-btn">Drop</button>
    <button id="play" class="control-btn">Play</button>
    `;

    document.getElementById("app")?.appendChild(this.buttonWrapper);

    this.setHandlers();
    this.playButton.classList.add("show");
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

    this.playButton = document.getElementById("play") as HTMLButtonElement;

    this.playButton.addEventListener("click", () =>
      this.trigger("controllerPlay")
    );
  }

  showPlayButtons() {
    this.dropButton.classList.add("show");
    this.pauseButton.classList.add("show");

    this.playButton.classList.remove("show");
  }

  hidePlayButtons() {
    this.dropButton.classList.remove("show");
    this.pauseButton.classList.remove("show");

    this.playButton.classList.add("show");
  }
}
