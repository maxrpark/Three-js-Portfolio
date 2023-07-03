export default class TimeLineSlider {
  sliderWrapper: HTMLDivElement;
  timeLine: any;
  progressSlider: HTMLInputElement;
  pauseButton: HTMLButtonElement;

  constructor(tl: any) {
    this.timeLine = tl;
    this.createSlider();
  }

  createSlider() {
    this.sliderWrapper = document.createElement("div");
    this.sliderWrapper.setAttribute("class", "slider-container");

    document.body.appendChild(this.sliderWrapper);

    this.sliderWrapper.innerHTML = `
      <button class="button-gsap-animation" id="pause">pause</button>
       <input id="progressSlider" type="range" min="0" max="1" value="0" step="0.001" />
      <div id="time">0.00</div>
   `;

    this.sliderEvent();
    this.pauseButtonActions();

    const timeEl = this.sliderWrapper.querySelector("#time")!;

    this.timeLine.eventCallback("onUpdate", () => {
      this.progressSlider.value = this.timeLine.progress();
      timeEl.innerHTML = this.timeLine.time().toFixed(2);
    });
  }

  sliderEvent() {
    this.progressSlider = this.sliderWrapper.querySelector("#progressSlider")!;

    this.progressSlider = this.sliderWrapper.querySelector("#progressSlider")!;

    this.progressSlider.addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement;

      this.timeLine.progress(target.value).pause();
    });

    this.progressSlider.addEventListener("change", () => {
      this.pauseButton.innerHTML = "play";
    });
  }
  pauseButtonActions() {
    this.pauseButton = this.sliderWrapper.querySelector("#pause")!;
    this.pauseButton.addEventListener("click", () => {
      this.timeLine.paused(!this.timeLine.paused());
      if (this.timeLine.progress() == 1) {
        this.timeLine.restart();
      }
      this.pauseButton.innerHTML = this.timeLine.paused() ? "play" : "pause";
    });
  }
}
