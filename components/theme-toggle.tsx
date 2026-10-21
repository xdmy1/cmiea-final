"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  function toggle() {
    const next = document.documentElement.classList.toggle("dark");
    setDark(next);
    try {
      localStorage.setItem("color-theme", next ? "dark" : "light");
    } catch {}
  }
  return (
    <button
      className="site-icon-button"
      onClick={toggle}
      aria-label={
        dark ? "Activează tema deschisă" : "Activează tema întunecată"
      }
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
