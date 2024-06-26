import { Experience } from "../../experience/Experience";
import EventEmitter from "../../experience/utils/EventEmitter";
import Resources from "../../experience/utils/Resources";
import { gsap } from "gsap";
// import TimeLineSlider from "../../experience/utils/TimeLineSlider";

export default class LoadingModal extends EventEmitter {
  experience: Experience;
  resources: Resources;

  loadingProgress: number = 0;

  //
  modalWrapper: HTMLDivElement;
  loadingText: HTMLHeadElement;

  textColors: string[];
  textColorsAni: any;

  constructor() {
    super();
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.createModal();

    this.textColors = [
      "#388697",
      "#B5FFE1",
      "#08415C",
      "#F3E8EE",
      "#849324",
      "#729B79",
    ];

    this.resources.on("itemLoaded", () => this.modalLoader());
    this.textColorsAni = gsap.to(this.loadingText, {
      keyframes: this.textColors.map((color) => ({ color })),
      duration: 0.5 * this.textColors.length,
      repeat: -1,
    });
  }

  createModal() {
    this.modalWrapper = document.createElement("div");
    this.modalWrapper.classList.add("modal-progress");
    document.getElementById("app")?.appendChild(this.modalWrapper);

    this.modalWrapper.innerHTML = /*html*/ `
        <h2 class="loading-text"><h2>
        <div class="progress-section top-left"></div>
        <div class="progress-section top-right"></div>
        <div class="progress-section bottom-left"></div>
        <div class="progress-section bottom-right"></div>
        <div class="progress-modal-content">
            <h2 class="modal-text">Maxi <br/> Ruti</h2>
            <h3 class="modal-text">Creative Developer</h3>
        </div>

      `;

    this.loadingText = this.modalWrapper.querySelector(".loading-text")!;

    gsap.set(".modal-text", {
      visibility: "hidden",
    });
  }

  modalLoader() {
    this.loadingProgress = Math.floor(
      (this.resources.uploaded / this.resources.toUpload) * 100
    );
    this.animation();
  }

  animation() {
    this.loadingText.textContent = this.loadingProgress.toString();
  }
  progressModalOut() {
    let tl = gsap.timeline({ ease: "none" });

    const duration = 2;

    tl.to(this.loadingText, {
      opacity: 0,
      y: -60,
      onComplete: () => this.textColorsAni.kill(),
    })
      .set(".modal-text", {
        visibility: "visible",
      })
      .from(".modal-text", {
        y: 60,
        stagger: 0.2,
        opacity: 0,
      })
      .to(".modal-text", {
        opacity: 0,
        delay: 0.5,
        xPercent: -10,
        stagger: 0.2,
      })
      .to(".top-left", { yPercent: -100, xPercent: -100, duration }, "-=0.1")
      .to(
        ".top-right",
        {
          yPercent: -100,
          xPercent: 100,
          duration,
        },
        "<"
      )
      .to(".bottom-left", { yPercent: 100, xPercent: -100, duration }, "<")
      .to(
        ".bottom-right",
        {
          yPercent: 100,
          xPercent: 100,
          duration,
        },
        "<"
      )
      .to(
        {},
        {
          onStart: () => this.trigger("animationCompleted"),
        },
        "<+=20%"
      )
      .set(this.modalWrapper, {
        display: "none",
      });
  }
}
