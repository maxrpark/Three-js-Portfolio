import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

export default class CharacterController {
  keysPressed: {
    ArrowUp: boolean;
    ArrowDown: boolean;
    ArrowLeft: boolean;
    ArrowRight: boolean;
    ShiftLeft: boolean;
  };

  canRotate: boolean = true;
  // Mobile
  directionalController: HTMLElement;

  constructor() {
    this.keysPressed = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      ShiftLeft: false,
    };

    this.setDesktopControllers();

    // MOBILE
    this.setMobileControllers();
  }

  setDesktopControllers() {
    window.addEventListener("keydown", (event) => {
      //@ts-ignore
      this.keysPressed[event.code] = true;
    });

    window.addEventListener("keyup", (event) => {
      if (this.keysPressed.ArrowDown && !this.keysPressed.ArrowUp) {
        this.canRotate = true;
      }
      //@ts-ignore
      this.keysPressed[event.code as string] = false;
    });
  }

  setMobileControllers() {
    this.directionalController = document.getElementById(
      "directionalController"
    )!;

    const self = this;

    Draggable.create(this.directionalController, {
      bounds: "#directionalControllerWrapper",
      inertia: false,

      onDrag: function () {
        if (this.getDirection() === "up") {
          self.keysPressed.ArrowUp = true;
          self.keysPressed.ArrowRight = false;
          self.keysPressed.ArrowLeft = false;
          self.keysPressed.ArrowDown = false;
          self.canRotate = true;
        }
        if (this.getDirection() === "right") {
          self.keysPressed.ArrowRight = true;
          self.keysPressed.ArrowLeft = false;
        }

        if (this.getDirection() === "left") {
          self.keysPressed.ArrowLeft = true;
          self.keysPressed.ArrowRight = false;
        }
        if (this.getDirection() === "down" && !self.keysPressed.ShiftLeft) {
          self.keysPressed.ArrowUp = false;
          self.keysPressed.ArrowRight = false;
          self.keysPressed.ArrowLeft = false;
          self.keysPressed.ArrowDown = true;
        }
      },
      onDragEnd: function () {
        gsap.set(self.directionalController, {
          clearProps: "all",
        });

        self.keysPressed = {
          ...self.keysPressed,
          ArrowUp: false,
          ArrowDown: false,
          ArrowLeft: false,
          ArrowRight: false,
        };
        self.canRotate = true;
      },
    });

    function ignoreEvent(e: any) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.preventManipulation) {
        e.preventManipulation();
      }
      return false;
    }

    this.directionalController.addEventListener(
      "touchstart",
      ignoreEvent,
      false
    );
    this.directionalController.addEventListener("touchend", ignoreEvent, false);

    const runBtn = document.getElementById("runBtn")!;
    runBtn.addEventListener("touchstart", (event: any) => {
      event.stopPropagation();
      runBtn.classList.add("running");
      this.keysPressed.ShiftLeft = true;
    });
    runBtn.addEventListener("touchend", (event: any) => {
      event.stopPropagation();
      runBtn.classList.remove("running");
      this.keysPressed.ShiftLeft = false;
    });
  }
}
