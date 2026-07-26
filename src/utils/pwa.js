export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Nyx SW registered:", reg.scope))
        .catch((err) => console.log("Nyx SW registration failed:", err));
    });
  }
}
