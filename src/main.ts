import "./assets/styles/main.css";
import { Experience } from "./experience/Experience";

const canvas = document.createElement("canvas");
canvas.setAttribute("id", "webgl");

document.getElementById("app")?.appendChild(canvas);

new Experience(canvas);
