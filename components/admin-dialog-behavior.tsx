"use client";
import { useEffect } from "react";

export function AdminDialogBehavior({ ready }: { ready: boolean }) {
  useEffect(() => {
    if (!ready) return;
    let active: HTMLElement | null = null;
    let returnFocus: HTMLElement | null = null;
    const overflow = document.body.style.overflow;
    function update() {
      const visible = document.querySelector<HTMLElement>(
        ".admin-dialog:not(.hidden)",
      );
      if (visible === active) return;
      if (visible) {
        if (!active) returnFocus = document.activeElement as HTMLElement;
        active = visible;
        document.body.style.overflow = "hidden";
        (
          visible.querySelector<HTMLElement>(
            'input:not([type="hidden"]):not([readonly]), textarea, select:not(.hidden), button',
          ) || visible
        ).focus();
      } else {
        active = null;
        document.body.style.overflow = overflow;
        if (returnFocus?.isConnected) returnFocus.focus();
        returnFocus = null;
      }
    }
    function close() {
      const button = active?.querySelector<HTMLButtonElement>(
        '.admin-dialog-header button[aria-label], button[id^="cancel"], button[id^="close"]',
      );
      button?.click();
    }
    function keydown(event: KeyboardEvent) {
      if (!active) return;
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key !== "Tab") return;
      const focusable = [
        ...active.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
        ),
      ].filter((element) => element.getClientRects().length);
      const first = focusable[0],
        last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    function click(event: MouseEvent) {
      if (active && event.target === active) close();
    }
    const observer = new MutationObserver(update);
    observer.observe(document.querySelector(".legacy-admin") || document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    document.addEventListener("keydown", keydown);
    document.addEventListener("click", click);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("click", click);
      document.body.style.overflow = overflow;
    };
  }, [ready]);
  return null;
}
