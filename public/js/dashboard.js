console.log("Dashboard loaded successfully.");
// simple auto-dismiss for bootstrap alerts
document.addEventListener("DOMContentLoaded", () => {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach(a => setTimeout(() => {
    try { a.classList.remove("show"); a.classList.add("hide"); a.remove(); } catch(e){}
  }, 3500));
});
