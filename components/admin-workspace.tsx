"use client";
import { sitePath } from "@/lib/site-path";

import { useCallback, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Users,
  Inbox,
} from "lucide-react";
import { adminSections, type AdminSection } from "@/lib/navigation";
import type { LegacyDocument } from "@/lib/legacy";
import { LegacyView } from "./legacy-view";
import { AdminTeamEditor } from "./admin-team-editor";
import { AdminDialogBehavior } from "./admin-dialog-behavior";

export function AdminWorkspace({ document }: { document: LegacyDocument }) {
  const [active, setActive] = useState<AdminSection>("course");
  const [ready, setReady] = useState(false);
  function select(id: AdminSection) {
    setActive(id);
    if (id !== "team") window.showSection?.(id);
    history.replaceState(null, "", `#${id}`);
  }
  const booted = useCallback(() => {
    const id = location.hash.slice(1) as AdminSection;
    const initial = adminSections.some((section) => section.id === id)
      ? id
      : "course";
    setActive(initial);
    setReady(true);
    if (initial !== "team") window.showSection?.(initial);
  }, []);
  return (
    <main className="admin-workspace">
      <AdminDialogBehavior ready={ready} />
      <aside className="admin-sidebar" aria-label="Secțiuni de administrare">
        <div className="admin-sidebar-title">
          <span>CMIEA</span>
          <h1>Administrare</h1>
        </div>
        {["Conținut", "Înscrieri", "Comunitate"].map((group) => (
          <div className="admin-nav-group" key={group}>
            <h2>{group}</h2>
            {adminSections
              .filter((section) => section.group === group)
              .map((section) => (
                <button
                  key={section.id}
                  disabled={!ready}
                  aria-current={active === section.id ? "page" : undefined}
                  aria-controls={`${section.id}Section`}
                  onClick={() => select(section.id)}
                >
                  {section.id === "course" ? (
                    <BookOpen size={18} />
                  ) : section.id === "events" ? (
                    <CalendarDays size={18} />
                  ) : section.group === "Înscrieri" ? (
                    <Inbox size={18} />
                  ) : (
                    <Users size={18} />
                  )}
                  <span>{section.label}</span>
                </button>
              ))}
          </div>
        ))}
        <a className="admin-back" href={sitePath("/home/")}>
          Vezi site-ul <ArrowUpRight size={16} />
        </a>
      </aside>
      <div className="admin-main">
        <div className="admin-topline">
          <p>
            Administrare{" "}
            <span>
              / {adminSections.find((section) => section.id === active)?.label}
            </span>
          </p>
          <span className="admin-workspace-badge">Spațiul echipei</span>
        </div>
        <label className="admin-mobile-select">
          Secțiune
          <select
            value={active}
            disabled={!ready}
            onChange={(event) => select(event.target.value as AdminSection)}
          >
            {adminSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
        </label>
        {active === "team" ? <AdminTeamEditor /> : null}
        <div hidden={active === "team"}>
          <LegacyView document={document} page="admin" onReady={booted} />
        </div>
      </div>
    </main>
  );
}
