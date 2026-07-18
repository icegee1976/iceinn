import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PortfolioSite } from "../app/components/PortfolioSite";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PortfolioSite />
  </StrictMode>,
);
