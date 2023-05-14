import EventEmitter from "../../experience/utils/EventEmitter";
import { gsap } from "gsap";

interface gameOverParams {
  score: number;
}

export default class Modal extends EventEmitter {
  private modalWrapper: HTMLDivElement;
  private timeLine: any;

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

    // Modal Events
    const gameStart = document.getElementById("gameStart")!;
    const exploreWorld = document.getElementById("exploreWorld")!;

    gameStart.addEventListener("click", () =>
      this.trigger("handleGameStartClick")
    );

    exploreWorld.addEventListener("click", () =>
      this.trigger("handleExploreWorld")
    );
    this.animation();
  }
  public gameOver({ score }: gameOverParams) {
    this.display("flex");

    // Modal Content
    this.modalWrapper.innerHTML = /*html*/ ` 
    <div class="modal-content">
       <h2>Game Over</h2>
       <h3>Your score is ${score}</h3>
      <button id="gameRestart" class="btn">Re Start</button>
      <button id="exitGame" class="btn">Exist</button>
      <button id="exploreWorld" class="btn">Explore</button>
    </div>
    `;

    // Modal Events
    const gameRestart = this.modalWrapper.querySelector("#gameRestart")!;
    const exploreWorld = this.modalWrapper.querySelector("#exploreWorld")!;

    const exitGame = this.modalWrapper.querySelector("#exitGame")!;

    exitGame.addEventListener("click", () => this.trigger("handleExit"));

    gameRestart.addEventListener("click", () =>
      this.trigger("handleGameRestart")
    );

    exploreWorld.addEventListener("click", () =>
      this.trigger("handleExploreWorld")
    );

    // animation

    this.animation();
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
    // animation

    this.animation();
  }

  animation() {
    this.timeLine = gsap.timeline({ paused: true });

    this.timeLine
      .to(this.modalWrapper, {
        background: "rgba(255, 255, 255, 0.3)",
      })
      .from(".btn", {
        yPercent: 100,
        opacity: 0,
        scale: 0.9,
      });

    // timeLine.reversed(!timeLine.reversed());
    if (this.timeLine.isActive()) {
      this.timeLine.reverse();
      console.log("reversed");
    } else {
      this.timeLine.play();
      console.log("play");
    }
  }
  reverseAnimation() {
    // this.timeLine.reverse();

    if (this.timeLine.isActive()) {
      this.timeLine.reverse();
      console.log("one");
    } else {
      this.timeLine.reverse().then(() => {
        console.log("two");
        this.display("none");

        // complete any additional tasks that need to be done when the animation is finished playing backwards
        // for example, hiding the modal or resetting its state
      });
    }
  }
}
