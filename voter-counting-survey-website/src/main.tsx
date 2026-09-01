import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    if (
      e.message &&
      (e.message.includes("startTime") ||
        e.message.includes("reportAllChanges") ||
        e.message.includes("message channel closed"))
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);

  window.addEventListener("unhandledrejection", (e) => {
    if (
      e.reason &&
      e.reason.message &&
      (e.reason.message.includes("startTime") ||
        e.reason.message.includes("reportAllChanges") ||
        e.reason.message.includes("message channel closed"))
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
