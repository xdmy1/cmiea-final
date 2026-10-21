"use client";
import { sitePath } from "@/lib/site-path";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { navigation, community } from "@/lib/navigation";
import { useAuth } from "./auth-provider";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const { user, isAdmin, name, loading, logout } = useAuth();
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (event.key === "Tab") {
        const elements =
          panel.current?.querySelectorAll<HTMLElement>("a, button");
        if (!elements?.length) return;
        const first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    function resize() {
      if (window.innerWidth >= 1200) setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  const isActive = (href: string) => pathname === href;
  const navLink = ({ href, label }: { href: string; label: string }) => (
    <a
      key={href}
      href={sitePath(href)}
      aria-current={isActive(href) ? "page" : undefined}
    >
      {label}
    </a>
  );
  const account = loading ? (
    <span className="site-auth-loading">Contul meu</span>
  ) : user ? (
    <details className="site-community">
      <summary className="site-user-button">
        <span>{name}</span>
        <ChevronDown size={14} />
      </summary>
      <div className="site-account-menu">
        <a href={sitePath(isAdmin ? "/admin/" : "/dashboard/")}>
          {isAdmin ? "Administrare" : "Contul meu"}
        </a>
        <button onClick={() => void logout()}>Deconectare</button>
      </div>
    </details>
  ) : (
    <div className="site-auth-buttons">
      <a href={sitePath("/login/")} className="site-login">
        Autentificare
      </a>
      <a href={sitePath("/register/")} className="site-signup">
        Creează cont
      </a>
    </div>
  );
  return (
    <>
      <header className="site-header">
        <nav className="site-nav" aria-label="Navigare principală">
          <a
            href={sitePath("/home/")}
            className="site-brand"
            aria-label="CMIEA — pagina principală"
          >
            <img
              src={sitePath("/assets/icon.png")}
              width={36}
              height={36}
              alt=""
            />
            <span>CMIEA</span>
          </a>
          <div className="site-nav-links">
            {navigation.slice(0, 2).map(navLink)}
            <CommunityMenu
              active={community.some((item) => isActive(item.href))}
            />
            {navigation.slice(2).map(navLink)}
          </div>
          <div className="site-account">
            {account}
            <ThemeToggle />
          </div>
          <button
            ref={trigger}
            className="site-icon-button site-menu-toggle"
            onClick={() => setOpen(true)}
            aria-label="Deschide meniul"
            aria-controls="mobile-navigation"
            aria-expanded={open}
          >
            <Menu />
          </button>
        </nav>
      </header>
      {open ? (
        <nav
          ref={panel}
          id="mobile-navigation"
          className="site-mobile-menu"
          aria-label="Navigare mobilă"
        >
          <div className="site-mobile-inner">
            <div className="site-mobile-heading">
              <span>Meniu</span>
              <button
                className="site-icon-button"
                onClick={() => {
                  setOpen(false);
                  trigger.current?.focus();
                }}
                aria-label="Închide meniul"
              >
                <X />
              </button>
            </div>
            {navigation.slice(0, 2).map(navLink)}
            <p className="site-mobile-label">Comunitate</p>
            {community.map(navLink)}
            {navigation.slice(2).map(navLink)}
            <hr />
            <div className="site-mobile-auth">{account}</div>
            <ThemeToggle />
          </div>
        </nav>
      ) : null}
    </>
  );
}

function CommunityMenu({ active }: { active: boolean }) {
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function click(event: MouseEvent) {
      if (!details.current?.contains(event.target as Node))
        details.current?.removeAttribute("open");
    }
    function key(event: KeyboardEvent) {
      if (event.key === "Escape" && details.current?.open) {
        details.current.open = false;
        details.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("click", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("click", click);
      document.removeEventListener("keydown", key);
    };
  }, []);
  return (
    <details
      ref={details}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && details.current)
          details.current.open = true;
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType === "mouse" &&
          details.current &&
          !details.current.matches(":focus-within")
        )
          details.current.open = false;
      }}
      className={`site-community${active ? " is-active" : ""}`}
    >
      <summary>
        Comunitate <ChevronDown size={14} />
      </summary>
      <div className="site-community-menu">
        {community.map((item) => (
          <a key={item.href} href={sitePath(item.href)}>
            <strong>
              {item.label}
              <ArrowUpRight size={14} />
            </strong>
            <span>{item.description}</span>
          </a>
        ))}
      </div>
    </details>
  );
}
