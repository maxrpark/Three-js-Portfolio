import "./static/styles/projects.css";

import { projectsMobile } from "./projects/mobileProjects";
import { setThreeExperience } from "./projects/desktopProjects";
import { getAllProjects } from "./projects/getProjects";

getAllProjects().then((result: any) => {
  let data = result;
  projectsMobile(data);
  setThreeExperience(data);
});
