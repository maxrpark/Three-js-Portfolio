import { gsap } from "gsap";
const projectVersion = document.getElementById(
  "projectVersion"
) as HTMLParagraphElement;

const tagsContainer = document.querySelector("#tags") as HTMLDivElement;

const btnLaunchProject = document.querySelector(
  "#btnLaunchProject"
) as HTMLAnchorElement;

interface Params {
  version: string;
  projectUrl: string;
  tags: [];
}

export const setSideSection = ({ version, projectUrl, tags }: Params) => {
  projectVersion.textContent = version;
  btnLaunchProject.href = projectUrl;
  const tagsContent = tags
    .map((el) => {
      return `
     <p  class="project-overview__details-text">${el}</p>
    `;
    })
    .join("");
  tagsContainer.innerHTML = tagsContent;

  gsap.from(
    ".project-overview__details-title, .project-overview__details-text",
    {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
    }
  );

  const tl = gsap.timeline({ paused: true });

  tl.to(".btn-launch-icon", {
    yPercent: "-=150",

    duration: 0.8,
    ease: "power4.inOut",
  });

  gsap.set(".top", {
    color: "var(--primary-black)",
  });
  gsap.set(".bottom", {
    yPercent: 100,
    top: "50%",
    color: "var(--primary-white-1)",
  });

  btnLaunchProject.addEventListener("mouseenter", (event) => {
    tl.play();
    const rect = btnLaunchProject.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const widthPercent = (x / rect.width) * 100;
    const heightPercent = (y / rect.height) * 100;

    gsap.set(".btn-launch-bg", {
      transformOrigin: "center center",
      // duration: 1,
      clipPath: `circle(0% at ${widthPercent.toFixed()}% ${heightPercent.toFixed()}%)`,
    });
    gsap.to(".btn-launch-bg", {
      transformOrigin: "center center",
      // duration: 1,
      clipPath: `circle(140% at ${widthPercent.toFixed()}% ${heightPercent.toFixed()}%)`,
    });
    // console.log((offsetX * btnLaunchProject.offsetLeft) / 100);
  });
  btnLaunchProject.addEventListener("mouseleave", (event) => {
    tl.reverse();
    const rect = btnLaunchProject.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const widthPercent = (x / rect.width) * 100;
    const heightPercent = (y / rect.height) * 100;

    gsap.to(".btn-launch-bg", {
      transformOrigin: "center center",
      // duration: 1,
      clipPath: `circle(0% at ${widthPercent.toFixed()}% ${heightPercent.toFixed()}%)`,
    });
  });
};
