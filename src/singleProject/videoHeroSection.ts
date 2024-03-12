import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { setBGImage } from "./helperFunctions";
gsap.registerPlugin(Flip);

const btnPlay = document.querySelector("#btnPlay") as HTMLButtonElement;
const closeBtn = document.querySelector("#closeBtn") as HTMLButtonElement;
const video = document.querySelector("#video") as HTMLIFrameElement;
const iframDIV = document.querySelector(".iframDIV")! as HTMLDivElement;
const videoCover = document.querySelector("#videoCover")! as HTMLDivElement;
const projectDesc = document.getElementById(
  "projectDesc"
) as HTMLParagraphElement;

const videoIframeContainer = document.getElementById(
  "videoIframeContainer"
)! as HTMLDivElement;
const videoWrapper = document.getElementById("videoWrapper")! as HTMLDivElement;
const hero = document.querySelector(".hero")! as HTMLDivElement;

const heroOverlay = document.querySelector(".hero__overlay")! as HTMLDivElement;

interface Params {
  lenis: any;
  image: string;
  projectVideo: string;
  shortDsc: string;
}

export const videoHeroSection = ({
  lenis,
  image,
  projectVideo,
  shortDsc,
}: Params) => {
  hero.appendChild(iframDIV);
  video.src = projectVideo + "?rel=0&showinfo=0&modestbranding=1";
  projectDesc.textContent = shortDsc;
  setBGImage(videoCover, image);

  let isAnimation = false;

  btnPlay.addEventListener("click", () => {
    if (isAnimation) return;

    const state = Flip.getState(iframDIV);

    lenis.stop();
    videoIframeContainer.appendChild(iframDIV);

    gsap
      .timeline()
      .set(videoWrapper, {
        opacity: 1,
      })
      .to(heroOverlay, {
        opacity: 0,
        onStart: () => {
          isAnimation = true;
        },
      })

      .to(
        videoWrapper,
        {
          duration: 1,
          background: "rgba(15, 14, 23, .9)",
          onStart: () => {
            Flip.from(state, {
              duration: 1,
              ease: "power1.inOut",
              fade: true,
              absolute: true,
              opacity: 1,
            });
          },
        },
        0
      )
      .to(videoCover, {
        opacity: 0,
      })
      .to(videoIframeContainer, {
        opacity: 1,
      });
  });

  closeBtn.addEventListener("click", () => {
    if (!isAnimation) return;

    const state = Flip.getState(iframDIV);
    hero.appendChild(iframDIV);
    lenis.start();

    gsap.set(videoCover, {
      opacity: 1,
    });

    gsap
      .timeline()
      .set(videoWrapper, {
        background: "transparent",
      })
      .to(
        {},
        {
          duration: 1,
          onStart: () => {
            Flip.from(state, {
              duration: 1,
              ease: "power1.inOut",
              absolute: true,
              fade: true,
            });
          },
        },
        0
      )
      .to(heroOverlay, {
        opacity: 1,
      })
      .to(videoWrapper, {
        opacity: 0,
        onComplete: () => {
          isAnimation = false;
        },
      });
  });
};
