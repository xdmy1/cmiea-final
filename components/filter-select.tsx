"use client";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

type Option = { value: string; label: string };
export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<{
    left: number;
    top: number;
    width: number;
    maxHeight: number;
  } | null>(null);
  const selected = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(Math.max(rect.width, 220), window.innerWidth - 32);
      const below = window.innerHeight - rect.bottom - 16;
      const above = rect.top - 16;
      const height = Math.min(
        320,
        Math.max(40, Math.max(below, above) - 8),
        options.length * 44 + 16,
      );
      const upward = below < height && above > below;
      setPosition({
        left: Math.max(16, Math.min(rect.left, window.innerWidth - width - 16)),
        top: upward ? Math.max(8, rect.top - height - 8) : rect.bottom + 8,
        width,
        maxHeight: height,
      });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, options.length]);
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !menu.current?.contains(target))
        setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  useEffect(() => {
    if (open)
      document
        .getElementById(id + "-" + active)
        ?.scrollIntoView({ block: "nearest" });
  }, [open, active, id, position?.maxHeight]);
  function choose(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  }
  function keydown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? options.length - 1
            : !open
              ? selected
              : (active +
                  (event.key === "ArrowDown" ? 1 : -1) +
                  options.length) %
                options.length;
      setActive(next);
      setOpen(true);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(active);
      else {
        setActive(selected);
        setOpen(true);
      }
      return;
    }
    if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      const now = Date.now();
      const text =
        (now - typed.current.at < 600 ? typed.current.text : "") +
        event.key.toLocaleLowerCase("ro");
      typed.current = { text, at: now };
      const found = options.findIndex((option) =>
        option.label.toLocaleLowerCase("ro").startsWith(text),
      );
      if (found >= 0) setActive(found);
      setOpen(true);
    }
  }
  return (
    <span className="filter-select">
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? id : undefined}
        aria-activedescendant={open ? id + "-" + active : undefined}
        className="filter-select-trigger"
        onKeyDown={keydown}
        onBlur={() => setOpen(false)}
        onClick={() => {
          setActive(selected);
          setOpen(!open);
        }}
      >
        <span>{options[selected]?.label || label}</span>
        <ChevronDown size={16} aria-hidden />
      </button>
      {open && position
        ? createPortal(
            <div
              ref={menu}
              id={id}
              role="listbox"
              aria-label={label}
              className="filter-select-menu"
              style={position}
              onPointerDown={(event) => event.preventDefault()}
            >
              {options.map((option, index) => (
                <div
                  id={id + "-" + index}
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  data-active={index === active}
                  className="filter-select-option"
                  onPointerMove={() => setActive(index)}
                  onClick={() => choose(index)}
                >
                  <span>{option.label}</span>
                  {option.value === value ? (
                    <Check size={16} aria-hidden />
                  ) : null}
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </span>
  );
}
