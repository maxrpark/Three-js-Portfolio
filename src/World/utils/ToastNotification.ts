import { gsap } from "gsap";
export interface ToastMessage {
  title: string;
  text: string;
  className: string;
  image: string;
}

export default class ToastNotification {
  toastWrapper: HTMLDivElement;

  private _title: string = "";
  private _img: string = "";
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
    this.toastWrapper.querySelector(".toast-description__title")!.textContent =
      value;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
    this.toastWrapper.querySelector(
      ".toast-description__message"
    )!.textContent = value;
  }

  set img(value: string) {
    this._img = value;
    (
      this.toastWrapper.querySelector(".toast-img-icon") as HTMLImageElement
    ).src = value;
  }

  get img(): string {
    return this._img;
  }

  get className() {
    return this._className;
  }
  set className(value: string) {
    this._className = value;
    this.toastWrapper
      .querySelector(".toast-content")!
      .setAttribute("id", this.className);
  }

  createUI() {
    this.toastWrapper = document.createElement("div");
    this.toastWrapper.classList.add("toast-wrapper");

    this.toastWrapper.innerHTML = /*html*/ `
      <div class='toast-content' id="">
          <div
          class="toast-img">
          <img src="${this.img}" alt='' class='toast-img-icon' />
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
      // yPercent: 10,
      yPercent: -100,
    });
  }
  showToast({ title, text, className, image }: ToastMessage) {
    this.title = title;
    this.text = text;
    this.className = className;
    this.img = image;

    let tl = gsap.timeline({});
    tl.set(this.toastWrapper, { xPercent: -50, left: "50%", yPercent: -100 })
      .to(this.toastWrapper, { yPercent: 10, opacity: 1 })
      .to(this.toastWrapper, {
        delay: 3,
        opacity: 0,
        yPercent: -100,
      });
  }
}
