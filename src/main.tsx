import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { lenis } from "./lib/lenis";

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);