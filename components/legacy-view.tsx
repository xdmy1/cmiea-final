"use client";
import { sitePath } from "@/lib/site-path";

import { useEffect, useState } from "react";
import type { LegacyDocument, LegacyScript } from "@/lib/legacy";

declare global {
  interface Window {
    firebase?: { apps: unknown[]; initializeApp: (config: object) => unknown };
    showSection?: (section: string) => void;
  }
}
const loaded = new Map<string, Promise<void>>();
function loadScript(script: LegacyScript) {
  if (script.src && loaded.has(script.src)) return loaded.get(script.src)!;
  const promise = new Promise<void>((resolve, reject) => {
    const element = document.createElement("script");
    if (script.module) element.type = "module";
    if (script.src) {
      element.src = sitePath(script.src);
      element.onload = () => resolve();
      element.onerror = () =>
        reject(new Error("Nu s-a putut încărca formularul."));
    } else element.textContent = script.code || "";
    document.body.append(element);
    if (!script.src && !script.module) resolve();
  });
  if (script.src) loaded.set(script.src, promise);
  return promise;
}

// Existing Firebase forms retain their field IDs and business logic during the
// migration. All surrounding navigation and access control are React components.
export function LegacyView({
  document: content,
  page,
  onReady,
}: {
  document: LegacyDocument;
  page: string;
  onReady?: () => void;
}) {
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    async function boot() {
      try {
        if (["admin", "dashboard", "club", "eveniment"].includes(page)) {
          for (const part of ["app", "firestore", "auth"])
            await loadScript({
              src: `https://www.gstatic.com/firebasejs/9.6.10/firebase-${part}-compat.js`,
            });
          if (page === "dashboard" && !window.firebase?.apps.length)
            window.firebase?.initializeApp({
              apiKey: "AIzaSyBoWwArqP6pYGvVSBzCbUnOphhzk0Pi9oQ",
              authDomain: "tekwill-441fe.firebaseapp.com",
              projectId: "tekwill-441fe",
              storageBucket: "tekwill-441fe.firebasestorage.app",
              messagingSenderId: "990223834307",
              appId: "1:990223834307:web:c1a9da67d5e5f070db1676",
            });
        }
        for (const script of content.scripts) {
          if (!alive) return;
          await loadScript(script);
        }
        if (alive) {
          window.document.dispatchEvent(new Event("cmiea:legacy-ready"));
          onReady?.();
        }
      } catch (error) {
        if (alive)
          setError(
            error instanceof Error ? error.message : "Eroare la încărcare.",
          );
      }
    }
    void boot();
    return () => {
      alive = false;
    };
  }, [content, page, onReady]);
  return (
    <>
      {error ? (
        <p className="catalog-status" role="alert">
          {error}{" "}
          <button
            className="app-button secondary"
            onClick={() => location.reload()}
          >
            Reîncarcă pagina
          </button>
        </p>
      ) : null}
      <div
        className={`legacy-view legacy-${page}`}
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    </>
  );
}
