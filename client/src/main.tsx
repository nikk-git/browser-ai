import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for offline support (if available)
// Service workers work on HTTPS or localhost
if ('serviceWorker' in navigator && 
    (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        // Service workers may not work in all environments - fail silently
        console.warn('Service Worker not available:', error.message);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
