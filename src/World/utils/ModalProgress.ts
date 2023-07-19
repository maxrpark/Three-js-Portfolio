import { Experience } from "../../experience/Experience";
import EventEmitter from "../../experience/utils/EventEmitter";
import { Badge } from "../../ts/globalTs";
import UserProgress from "../UserProgress";
import { gsap } from "gsap";
export default class ModalProgress extends EventEmitter {
  experience: Experience;
  userProgress: UserProgress;
  modalProgressWrapper: HTMLDivElement;
  _isModalVisible: boolean;

  constructor() {
    super();
    this.experience = new Experience();
    this.userProgress = this.experience.world.userProgress;

    this.setLayout();
  }

  get badges() {
    return this.userProgress.badges;
  }

  get totalExperience() {
    return this.userProgress.totalExperience;
  }

  get earnedExperience() {
    return this.userProgress.earnedExperience;
  }

  get isModalVisible() {
    return this._isModalVisible;
  }

  set isModalVisible(visible: boolean) {
    this._isModalVisible = visible;
  }

  setLayout() {
    this.modalProgressWrapper = document.createElement("div");
    this.modalProgressWrapper.classList.add("my-progress-modal");

    document.getElementById("app")?.appendChild(this.modalProgressWrapper);

    gsap.set(this.modalProgressWrapper, {
      rotate: 170,
      transformOrigin: "bottom right",
    });
  }

  modalContent() {
    // <p class='experience-total experience-pill'>
    //   Total Available: ${this.totalExperience} XP
    // </p>;
    this.modalProgressWrapper.innerHTML = /*html*/ `
 
      <div class='experience-wrapper'>
        <p class="experience-earned experience-pill">Earned: ${
          this.earnedExperience
        } XP</p>
        <h2 class="modal-title">My Progress</h2>

      </div>
      <div class="progress-badges-wrapper">
      ${this.badges
        .map((badge: Badge) => {
          return this.singleProgress(badge);
        })
        .join("")}
      </div>
      <div class="my-progress-modal__buttons-wrapper">
        <button id="resetPlayerProgress" class="my-progress-modal__buttons-wrapper-btn">Reset Progress</button>
        <button id="closeModalProgress" class="my-progress-modal__buttons-wrapper-btn-close">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z">
          </path>
        </svg>
        </button>
      </div>
      `;
  }

  singleProgress(badge: Badge) {
    return /*html*/ `
            <div class="single-badge ${
              badge.isCollected ? "badge-collected" : ""
            }">

            <div class="badge-img-wrapper ${
              badge.isCollected ? "show-icon" : ""
            }">
              <img src="${badge.src}"/>
            </div>

            <div class='single-badge__top'>
            <p class='single-badge__top-title'>${badge.name}</p>
            <p class="single-badge__top-experience experience-pill">${
              badge.experience
            } XP</p>
            </div>
            <p class='single-badge__text'>${badge.text}</p>
            ${
              badge.typeCollection && !badge.isCollected
                ? `
            <div class="single-badge__progress">
                <div class="progress-container">
                <div class="progress-bar" style="width:${badge.isCollected}%"></div>   
                </div> 
      
              <small>${badge.hasCollected}/${badge.totalToCollect}</small>
            </div>`
                : ""
            }
          </div>
    `;
  }

  openModal() {
    this.modalContent();

    const resetPlayerProgress = this.modalProgressWrapper.querySelector(
      "#resetPlayerProgress"
    )!;

    resetPlayerProgress.addEventListener("click", () =>
      this.userProgress.resetProgress()
    );

    const closeModalProgress = this.modalProgressWrapper.querySelector(
      "#closeModalProgress"
    )!;

    closeModalProgress.addEventListener("click", () => this.closeModal());

    let tl = gsap.timeline({});
    tl.fromTo(
      ".btn",
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
          each: 0.2,
        },
      }
    )
      .fromTo(
        ".modal-texts-wrapper",
        {
          opacity: 1,
          scale: 1,
        },
        {
          opacity: 0,
          scale: 0.9,
        },
        0
      )
      .to(
        this.modalProgressWrapper,
        {
          rotate: 0,
          transformOrigin: "bottom right",
        },
        "-=.5"
      );
  }
  closeModal() {
    let tl = gsap.timeline({});
    tl.to(this.modalProgressWrapper, {
      rotate: 170,
      duration: 1,
      transformOrigin: "bottom right",
    })
      .fromTo(
        ".modal-texts-wrapper",
        {
          opacity: 0,
          scale: 0.9,
        },
        {
          opacity: 1,
          scale: 1,
        },
        0
      )
      .fromTo(
        ".btn",
        {
          yPercent: 100,
          opacity: 0,
          scale: 0.9,
        },
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.2,
        },
        "<"
      );
  }
}
