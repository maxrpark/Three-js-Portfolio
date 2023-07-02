import { Experience } from "../../experience/Experience";
import EventEmitter from "../../experience/utils/EventEmitter";
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
    this.modalProgressWrapper.innerHTML = /*html*/ `
      <div class="modal-title"></div>
      <div class="progress-badges-wrapper">
      ${this.badges
        .map((badge: any) => {
          return this.singleProgress(badge);
        })
        .join("")}
      </div>
      <button id="resetProgress" class="">Reset Progress</button>
      <button id="closeModalProgress" class="">Close Modal</button>
      `;
  }

  singleProgress(badge: any) {
    return /*html*/ `
            <div class="single-badge">${badge.name}
            ${
              badge.typeCollection &&
              `
              <div class="progress-container">
                <div class="progress-bar" style="width:${
                  (badge.hasCollected * 100) / badge.totalToCollect
                }%"></div>   
              </div>
            `
            }
            
            </div>
    `;
  }

  openModal() {
    this.modalContent();

    const closeModalProgress = this.modalProgressWrapper.querySelector(
      "#closeModalProgress"
    )!;

    closeModalProgress.addEventListener("click", () => this.closeModal());
    gsap.to(this.modalProgressWrapper, {
      rotate: 0,
      transformOrigin: "bottom right",
    });
  }
  closeModal() {
    gsap.to(this.modalProgressWrapper, {
      rotate: 170,
      duration: 1,
      transformOrigin: "bottom right",
    });
  }
}
