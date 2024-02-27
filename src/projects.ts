import "./static/styles/projects.css";

import { setThreeExperience } from "./projects/setThreeExperience";
import { getAllProjects } from "./projects/getProjects";

getAllProjects().then((result: any) => setThreeExperience(result));
