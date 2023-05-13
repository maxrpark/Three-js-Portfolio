import EventEmitter from "../../experience/utils/EventEmitter";

interface gameOverParams {
  score: number;
}

export default class Modal extends EventEmitter {
  private modalWrapper: HTMLDivElement;

  constructor() {
    super();
    this.createModal();
  }
  private createModal() {
    this.modalWrapper = document.createElement("div");
    this.modalWrapper.classList.add("modal-wrapper");
    document.getElementById("app")?.appendChild(this.modalWrapper);
  }

  public display(type: "none" | "flex" = "none") {
    this.modalWrapper.style.display = type;
  }

  public intro() {
    this.display("flex");

    // Modal Content
    this.modalWrapper.innerHTML = /*html*/ ` 
    <div class="modal-content">
      <button id="gameStart" class="btn">Start</button>
      <button id="gameScores" class="btn">Scores</button>
      <button id="exploreWorld" class="btn">Explore</button>
      </div>
      `;
    // <button id="multiPlayer" class="btn">Play with a friend</button>

    // Modal Events
    const gameStart = document.getElementById("gameStart")!;
    const exploreWorld = document.getElementById("exploreWorld")!;
    // const gameScores = document.getElementById("gameScores")!;
    // const multiPlayer = document.getElementById("multiPlayer")!;

    gameStart.addEventListener("click", () =>
      this.trigger("handleGameStartClick")
    );

    exploreWorld.addEventListener("click", () => {
      this.display("none");
    });
  }
  public gameOver({ score }: gameOverParams) {
    this.display("flex");

    // Modal Content
    this.modalWrapper.innerHTML = /*html*/ ` 
    <div class="modal-content">
       <h2>Game Over</h2>
       <h3>Your score is ${score}</h3>
      <button id="gameRestart" class="btn">Re Start</button>
      <button id="exploreWorld" class="btn">Explore</button>
    </div>
    `;

    // Modal Events
    const gameRestart = this.modalWrapper.querySelector("#gameRestart")!;
    const exploreWorld = this.modalWrapper.querySelector("#exploreWorld")!;

    gameRestart.addEventListener("click", () =>
      this.trigger("handleGameRestart")
    );

    exploreWorld.addEventListener("click", () => {
      this.display("none");
    });
  }
  public pauseMode() {
    this.display("flex");

    // Modal Content
    this.modalWrapper.innerHTML = /*html*/ ` 
    <div class="modal-content">
      <button id="gameContinue" class="btn">Continue</button>
      <button id="exitGame" class="btn">Exist</button>
    </div>
    `;

    // Modal Events
    const gameContinue = this.modalWrapper.querySelector("#gameContinue")!;
    const exitGame = this.modalWrapper.querySelector("#exitGame")!;

    exitGame.addEventListener("click", () => this.trigger("handleExit"));

    gameContinue.addEventListener("click", () =>
      this.trigger("handleContinue")
    );
  }
}
