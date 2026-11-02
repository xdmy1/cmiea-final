const menuButton = document.getElementById("mobile-toggle");
const mobileNav = document.getElementById("phone-nav");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let menuOpen = false;
let menuAnimation;
function setMenu(open) {
  menuOpen = open;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Închide meniul" : "Deschide meniul",
  );
  mobileNav.inert = !open;
  if (reducedMotion.matches) {
    menuAnimation?.cancel();
    menuAnimation = null;
    mobileNav.classList.toggle("hidden", !open);
    return;
  }
  if (open) mobileNav.classList.remove("hidden");
  if (!menuAnimation) {
    if (!open) {
      mobileNav.classList.add("hidden");
      return;
    }
    menuAnimation = mobileNav.animate(
      [
        { opacity: 0, transform: "translateY(-8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 200, easing: "ease-out", fill: "both" },
    );
    menuAnimation.onfinish = () => {
      if (!menuOpen) {
        mobileNav.classList.add("hidden");
        menuAnimation.cancel();
        menuAnimation = null;
      }
    };
  } else {
    menuAnimation.playbackRate = open ? 1 : -1;
    menuAnimation.play();
  }
}
function closeMenu() {
  setMenu(false);
}
menuButton.addEventListener("click", () => setMenu(!menuOpen));
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

// Content is visible by default: motion never gates reading or interaction.
const revealTargets = new WeakSet();
const activeReveals = new Set();
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      revealObserver.unobserve(entry.target);
      if (reducedMotion.matches) return;
      const delay = Number(entry.target.dataset.revealDelay || 0);
      const animation = entry.target.animate(
        [
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 480,
          delay,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "backwards",
        },
      );
      activeReveals.add(animation);
      animation.finished
        .catch(() => {})
        .finally(() => activeReveals.delete(animation));
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
);
function observeReveal(element, delay = 0) {
  if (revealTargets.has(element)) return;
  revealTargets.add(element);
  element.dataset.revealDelay = delay;
  revealObserver.observe(element);
}
document
  .querySelectorAll(".hero-copy > *, .hero-visual")
  .forEach((element, index) => {
    observeReveal(element, Math.min(index * 55, 220));
  });
document
  .querySelectorAll(
    ".values-strip, .section-heading, .filters, .community, .closing",
  )
  .forEach((element) => observeReveal(element));
document
  .querySelectorAll(".review-grid figure")
  .forEach((element, index) => observeReveal(element, index * 65));
const coursesContainer = document.getElementById("courses-container");
const courseObserver = new MutationObserver(() => {
  coursesContainer
    .querySelectorAll(":scope > a")
    .forEach((card, index) => observeReveal(card, (index % 3) * 55));
});
courseObserver.observe(coursesContainer, { childList: true });
reducedMotion.addEventListener("change", () => {
  if (!reducedMotion.matches) return;
  activeReveals.forEach((animation) => animation.cancel());
  setMenu(menuOpen);
});
