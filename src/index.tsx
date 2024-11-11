import { render } from "solid-js/web";
import { Records } from "./Records";
import "./index.css";

const root = document.getElementById("root");

if (root) {
  render(() => <Records />, root);
}
