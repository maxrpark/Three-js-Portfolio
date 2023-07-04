import { gsap } from "gsap";
export interface ToastMessage {
  title: string;
  text: string;
  className: string;
}

export default class ToastNotification {
  toastWrapper: HTMLDivElement;
  imgName: string = "";
  private _title: string = "";
  private _text: string = "";
  private _className: string = "";
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

  get className() {
    return this._className;
    // this.toastWrapper.querySelector(".toast-message")!.textContent = value;
  }
  set className(value: string) {
    this._className = value;
    // this.toastWrapper.querySelector(".toast-message")!.textContent = value;
  }

  createUI() {
    this.toastWrapper = document.createElement("div");
    this.toastWrapper.classList.add("toast-wrapper");
    // <img src='src/static/images/fruit.jpeg' alt='' class='toast-img' />;
    this.toastWrapper.innerHTML = /*html*/ `
      <div class='toast-content ${this.className}'>
          <div
          class="toast-img">
          
          </div>
          <div class='toast-description'>
            <p class="toast-description__title">${this.title}
            Some title</p>
            <p class="toast-description__message">
            lorem20 max luci. Perro undia lorem20 max luci. Perro undia lorem20 max luci. Perro undia lorem20 max luci. Perro undia
              ${this.text}
            </p>
          </div>
      </div>
  `;

    document.getElementById("app")?.appendChild(this.toastWrapper);

    gsap.set(this.toastWrapper, {
      xPercent: -50,
      left: "50%",
      yPercent: -100,
    });
  }
  showToast({ title, text, className }: ToastMessage) {
    this.title = title;
    this.text = text;
    this.className = className;
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
