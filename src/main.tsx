import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeFrontEndProtection } from "./lib/protection";

// Initialize the front-end protection module at app startup.
// Visit the site with ?moiz=true to temporarily disable all protections.
initializeFrontEndProtection();

createRoot(document.getElementById("root")!).render(<App />);
