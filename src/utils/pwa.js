export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Nyx SW registered:", reg.scope);

          // Check for updates every 10 minutes
          setInterval(() => {
            reg.update().catch(() => {});
          }, 10 * 60 * 1000);

          // Listen for waiting SW → force activate
          if (reg.waiting) {
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
          }

          reg.addEventListener("updatefound", () => {
            const newSW = reg.installing;
            if (newSW) {
              newSW.addEventListener("statechange", () => {
                if (newSW.state === "installed" && navigator.serviceWorker.controller) {
                  // New version available → activate immediately
                  newSW.postMessage({ type: "SKIP_WAITING" });
                }
              });
            }
          });
        })
        .catch((err) => console.log("Nyx SW registration failed:", err));
    });

    // Listen for FORCE_RELOAD message from new SW
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "FORCE_RELOAD") {
        console.log("Nyx SW: new version activated, reloading...");
        window.location.reload();
      }
    });
  }
}
