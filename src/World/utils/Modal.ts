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

  public intro() {
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
    // this.openModal();
  }

  animation() {
    this.timeLine = gsap.timeline({ ease: "none" });

    let mm = gsap.matchMedia();
    let breakPoint = 687;
    mm.add(
      {
        isDesktop: `(min-width: ${breakPoint}px)`,
        isMobile: `(max-width: ${breakPoint - 1}px)`,
      },
      (context) => {
        //@ts-ignore
        let { isDesktop } = context.conditions;

        this.timeLine
          .to(".menu-icon, .controllers-container", {
            opacity: 0,
            y: isDesktop ? -100 : 100,
            stagger: 0.2,
          })
          .to(this.modalWrapper, {
            background: "rgba(255, 255, 255, 0.3)",
            display: "flex",
          })
          .from(
            ".btn",
            {
              yPercent: 100,
              opacity: 0,
              scale: 0.9,
              stagger: 0.2,
            },
            "<="
          );
      }
    );
  }

  openModal() {
    this.timeLine.play();
  }
  closeModal() {
    this.timeLine = gsap.timeline({ ease: "none" });

    this.timeLine
      .to(".btn", {
        yPercent: 100,
        opacity: 0,
        // scale: 0.9,
        stagger: {
          from: "end", //try "center" and "edges"
          each: 0.2,
        },
      })
      .to(this.modalWrapper, {
        background: "transparent",
        display: "none",
      })
      .to(".menu-icon, .controllers-container", {
        opacity: 1,
        y: 0,
        stagger: 0.2,
      });
  }
}
