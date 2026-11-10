import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import normalizeStyles from "normalize.css?inline";
import appStyles from "./index.scss?inline";
import leafletStyles from "leaflet/dist/leaflet.css?inline";
import markerClusterStyles from "leaflet.markercluster/dist/MarkerCluster.css?inline";
import markerClusterDefaultStyles from "leaflet.markercluster/dist/MarkerCluster.Default.css?inline";
import App from "./components/App/App.tsx";

const host = document.getElementById("react-pact-map");

if (!host) {
  throw new Error("Could not find the #react-pact-map mount element.");
}

const shadowRoot = host.attachShadow({ mode: "open" });

for (const css of [
  normalizeStyles,
  appStyles,
  leafletStyles,
  markerClusterStyles,
  markerClusterDefaultStyles,
]) {
  const style = document.createElement("style");
  style.textContent = css;
  shadowRoot.appendChild(style);
}

const appRoot = document.createElement("div");
shadowRoot.appendChild(appRoot);

createRoot(appRoot).render(
  <StrictMode>
    <App />
  </StrictMode>
);
