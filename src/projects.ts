import "./static/styles/projects.css";

import { projectsMobile } from "./projects/mobileProjects";
import { setThreeExperience } from "./projects/desktopProjects";
import { getData } from "./projects/getProjects";

getData().then((result) => {
  let data = result;
  projectsMobile(data);
  setThreeExperience(data);
});
