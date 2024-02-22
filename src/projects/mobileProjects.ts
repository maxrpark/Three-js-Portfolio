import { Project } from "../ts/globalTs";

const projectsSection = document.querySelector(".projects")!;

export const projectsMobile = (data: Project[]) => {
  const projects = data
    .map(function (project) {
      return ` 
        <article data-id"${project.id}" class="single-project id">
          <div class="project-info">
          <div class="img-container">
            <img class="project-img img" src="${project.url}" alt="${project.name}" />
            </div>
            <div class="project-description">
              <h4 class="">${project.version}</h4>
              <h2 class="project-name">${project.name}</h2>
              </div>
            </div>
          </div>
          <div class="project-links">
            <a href="${project.gitUrl}" target="_blank"
              ><i class="fab fa-github"></i></a>
          
              <a class=" btn project-btn" href="${project.projectUrl}" target="_blank">visit</a>
            
          </div>
        </article>
       `;
    })
    .join("");
  projectsSection.innerHTML = projects;
};
