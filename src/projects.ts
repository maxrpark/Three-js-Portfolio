import "./static/styles/projects.css";

import { setThreeExperience } from "./projects/setThreeExperience";
import { getAllProjects } from "./projects/getProjects";

getAllProjects().then((result: any) => {
  // Only for now
  // Pass only result when there are more projects
  setThreeExperience([...result, ...result]);
});
