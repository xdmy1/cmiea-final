const menuButton = document.getElementById("mobile-toggle");
const mobileNav = document.getElementById("phone-nav");
function closeMenu() {
  mobileNav.classList.add("hidden");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Deschide meniul");
}
menuButton.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("hidden") === false;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Închide meniul" : "Deschide meniul",
  );
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileNav.classList.contains("hidden")) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia("(min-width: 851px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
document.getElementById("home-theme").addEventListener("click", () => {
  const dark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("color-theme", dark ? "dark" : "light");
});
document.querySelectorAll("[data-search]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById("searchInput");
    input.value = button.dataset.search;
    input.focus();
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
});
