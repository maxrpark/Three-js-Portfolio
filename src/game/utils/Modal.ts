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
    this.modalWrapper.innerHTML = /*html*/ ` 
    <div class="modal-content">

      <div class="modal-texts-wrapper">
          <h2 class="modal-texts">Maxi Ruti</h2>
          <h3 class="modal-texts-wrapper">Creative Developer</h3>
       </div>
       <button id="exploreWorld" class="btn btn-primary">Explore</button>
       <button id="gameStart" class="btn btn-primary">Tower Stack</button>
      <button id="progressModal" class="btn btn-primary">My Progress</button>
      <div class="social-icons">
        <a href="https://twitter.com/MaxCodeJourney" target="_blank" class="btn btn-primary">
          <i class="fa fa-twitter"></i>
        </a>
        <a href="https://github.com/maxrpark" target="_blank" class="btn btn-primary">
          <i class="fa fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/maxi-ruti-202988227/" target="_blank" class="btn btn-primary">
          <i class="fa fa-linkedin"></i>
        </a>
      </div>
    </div>
      `;

    // Modal Events
    const gameStart = document.getElementById("gameStart")!;
    const exploreWorld = document.getElementById("exploreWorld")!;
    const progressModal = this.modalWrapper.querySelector("#progressModal")!;

    gameStart.addEventListener("click", () =>
      this.trigger("handleGameStartClick")
    );

    exploreWorld.addEventListener("click", () =>
      this.trigger("handleExploreWorld")
    );

    progressModal.addEventListener("click", () =>
      this.trigger("handleProgressModal")
    );

    this.animation();
  }
  public gameOver({ score }: gameOverParams) {
    // Modal Content
    this.modalWrapper.innerHTML = /*html*/ ` 
    <div class="modal-content">
       <div class="modal-texts-wrapper">
          <h2 class="modal-texts">Game Over</h2>
          <h3 class="modal-texts-wrapper">Your score is ${score}</h3>
       </div>
      <button id="gameRestart" class="btn btn-primary">Try Again</button>
      <button id="exploreWorld" class="btn btn-primary">Explore</button>
      <button id="progressModal" class="btn btn-primary">My Progress</button>
      <button id="exitGame" class="btn btn-primary">Exit</button>
    </div>
    `;

    // Modal Events
    const gameRestart = this.modalWrapper.querySelector("#gameRestart")!;
    const exploreWorld = this.modalWrapper.querySelector("#exploreWorld")!;
    const progressModal = this.modalWrapper.querySelector("#progressModal")!;

    const exitGame = this.modalWrapper.querySelector("#exitGame")!;

    exitGame.addEventListener("click", () => this.trigger("handleExit"));

    gameRestart.addEventListener("click", () =>
      this.trigger("handleGameRestart")
    );

    exploreWorld.addEventListener("click", () =>
      this.trigger("handleExploreWorld")
    );
    progressModal.addEventListener("click", () =>
      this.trigger("handleProgressModal")
    );

    // animation
    this.animation();
  }
  public pauseMode() {
    // Modal Content
    this.modalWrapper.innerHTML = /*html*/ ` 
    <div class="modal-content">
       <div class="modal-texts-wrapper">
          <h2 class="modal-texts">Pause</h2>
       </div>
      <button id="gameContinue" class="btn btn-primary">Continue</button>
      <button id="exitGame" class="btn btn-primary">Exit</button>
    </div>
    `;

    // Modal Events
    const gameContinue = this.modalWrapper.querySelector("#gameContinue")!;
    const exitGame = this.modalWrapper.querySelector("#exitGame")!;

    exitGame.addEventListener("click", () => this.trigger("handleExit"));

    gameContinue.addEventListener("click", () =>
      this.trigger("handleContinue")
    );

    this.animation();
  }

  animation() {
    this.timeLine = gsap.timeline({ ease: "none" });

    const modalButtons = this.modalWrapper.querySelectorAll(".btn");
    const modalTextWrapper = this.modalWrapper.querySelectorAll(
      ".modal-texts-wrapper"
    );
    this.timeLine
      .to(".menu-icon, .control-btn", {
        opacity: 0,
        xPercent: 100,
        scale: 0.5,
        stagger: 0.2,
      })
      .to(
        this.modalWrapper,
        {
          background: "rgba(255, 255, 255, 0.3)",
          display: "flex",
        },
        "<"
      )
      .fromTo(
        modalTextWrapper,
        {
          yPercent: 100,
          opacity: 0,
          scale: 0.6,
        },
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
        }
      )
      .fromTo(
        modalButtons,
        {
          yPercent: 100,
          opacity: 0,
          scale: 0.9,
        },
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
        },
        "<"
      );
  }

  closeModal() {
    this.timeLine = gsap.timeline({ ease: "none" });
    const modalButtons = this.modalWrapper.querySelectorAll(".btn");
    const modalTextWrapper = this.modalWrapper.querySelectorAll(
      ".modal-texts-wrapper"
    );

    this.timeLine
      .fromTo(
        modalButtons,
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
        },
        {
          yPercent: 100,
          opacity: 0,
          scale: 0.9,
          stagger: {
            from: "end",
            each: 0.1,
          },
        }
      )
      .fromTo(
        modalTextWrapper,
        {
          // y: 0,
          opacity: 1,
          scale: 1,
        },
        {
          // y: 30,
          opacity: 0,
          scale: 0.9,
        },
        0
      )
      .fromTo(
        this.modalWrapper,
        {
          background: "rgba(255, 255, 255, 0.3)",
        },
        {
          background: "transparent",
          display: "none",
        }
      )
      .fromTo(
        this.modalWrapper,
        {
          display: "flex",
        },
        {
          display: "none",
        }
      )
      .fromTo(
        ".menu-icon, .control-btn",
        {
          opacity: 0,
          xPercent: 100,
          scale: 0.5,
          stagger: 0.2,
        },
        {
          opacity: 1,
          xPercent: 0,
          scale: 1,
          stagger: 0.2,
        },
        "<"
      );
  }
}
