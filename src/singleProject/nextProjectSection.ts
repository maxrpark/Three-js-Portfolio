import { Project } from "../ts/globalTs";
import { setBGImage } from "./helperFunctions";
import { gsap } from "gsap";

const nextProjectName = document.getElementById(
  "nextProjectName"
) as HTMLParagraphElement;
const nextProjectVersion = document.getElementById(
  "nextProjectVersion"
) as HTMLParagraphElement;
const nextProjectSection = document.getElementById(
  "nextProjectSection"
) as HTMLAnchorElement;
const nextProjectAnchor = document.querySelector(
  ".next-project-link"
) as HTMLAnchorElement;

export const setNextProjectSection = (
  projects: Project[],
  projectId: string
) => {
  const currentIndex = projects.findIndex(
    (project: Project) => project.id === projectId
  );

  let nextIndex;
  if (currentIndex === projects.length - 1) {
    nextIndex = 0;
  } else {
    nextIndex = currentIndex + 1;
  }

  const nextProject = projects[nextIndex];
  nextProjectName.textContent = nextProject.name;
  nextProjectVersion.textContent = nextProject.version;

  nextProjectAnchor.href = `/project.html?id=${nextProject.id}`;

  setBGImage(nextProjectSection, nextProject.url);

  let mm = gsap.matchMedia();
  let breakPoint = 768;
  mm.add(
    {
      isDesktop: `(min-width: ${breakPoint}px)`,
      isMobile: `(max-width: ${breakPoint - 1}px)`,
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      let { isDesktop, isMobile }: any = context.conditions;

      if (isMobile) {
        gsap.set(".next-project-info", {
          yPercent: 0,
          opacity: 1,
        });
      } else if (isDesktop) {
        gsap.set(".next-project-info", { yPercent: 0 });
        let tl = gsap
          .timeline({ paused: true })
          .fromTo(
            ".next-project-text",
            { yPercent: 0, opacity: 1 },
            { yPercent: -50, opacity: 0, duration: 0.5 }
          )
          .fromTo(
            ".next-project-info",
            { yPercent: 50, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.2 },
            "<=.3"
          );
        nextProjectSection.addEventListener("mouseenter", () => {
          tl.play();
        });
        nextProjectSection.addEventListener("mouseleave", () => {
          tl.reverse();
        });
      }
    }
  );
};
