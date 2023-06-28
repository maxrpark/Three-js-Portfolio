import { gsap } from "gsap";
export interface ToastMessage {
  title: string;
  text: string;
}

export default class ToastNotification {
  toastWrapper: HTMLDivElement;
  imgName: string = "";
  private _title: string = "";
  private _text: string = "";
  constructor() {
    this.createUI();
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
    this.toastWrapper.querySelector(".toast-title")!.textContent = value;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
    this.toastWrapper.querySelector(".toast-message")!.textContent = value;
  }

  createUI() {
    this.toastWrapper = document.createElement("div");
    this.toastWrapper.classList.add("toast-wrapper");
    // <img src='src/static/images/fruit.jpeg' alt='' class='toast-img' />;
    this.toastWrapper.innerHTML = /*html*/ `
        <div></div>
        <div>
          <p class="toast-title">${this.title}</p>
          <p class="toast-message">
            ${this.text}
          </p>
        </div>
  `;

    document.getElementById("app")?.appendChild(this.toastWrapper);

    gsap.set(this.toastWrapper, { xPercent: -50, left: "50%", yPercent: -100 });
  }
  showToast({ title, text }: ToastMessage) {
    this.title = title;
    this.text = text;
    let tl = gsap.timeline({});
    tl.set(this.toastWrapper, { xPercent: -50, left: "50%", yPercent: -100 })
      .to(this.toastWrapper, { yPercent: 0, opacity: 1 })
      .to(this.toastWrapper, {
        delay: 3,
        opacity: 0,
        yPercent: -100,
      });
  }
}
