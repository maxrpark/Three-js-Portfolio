import "../static/styles/singleProject.css";

import { getAllProjects, getSingleProject } from "../projects/getProjects";
import { Project } from "../ts/globalTs";

import Lenis from "@studio-freight/lenis";
import { videoHeroSection } from "./videoHeroSection";
import { setSideSection } from "./sideSection";
import { setNextProjectSection } from "./nextProjectSection";
import { setRichContentSection } from "./setRichContentSection";

const urlParams = new URLSearchParams(window.location.search);
// Extract the project ID from the query parameters
const projectId = urlParams.get("id");

if (!projectId) {
  window.location.href = "/projects";
}
var root = document.getElementsByTagName("html")[0]; // '0' to assign the first (and only `HTML` tag)

root.setAttribute("id", `root-${projectId}`);
document.body.setAttribute("id", projectId!);

getSingleProject(projectId!).then((result) => {
  const { projectUrl, version, tags, url, video, shortDsc, longDsc } =
    result as unknown as Project;

  const lenis = new Lenis();
  lenis.scrollTo(0, {
    immediate: true,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  videoHeroSection({
    lenis,
    image: url,
    projectVideo: video,
    shortDsc: shortDsc,
  });
  setRichContentSection(longDsc);

  setSideSection({ projectUrl, version, tags });
});

getAllProjects().then((projects: any) => {
  setNextProjectSection(projects, projectId!);
});
