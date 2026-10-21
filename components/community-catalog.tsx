"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ArrowUpRight, CalendarDays, Users } from "lucide-react";
import { firebaseClient } from "@/lib/firebase";
import { eventStatus, safeImage, type CommunityItem } from "@/lib/catalog";

export function CommunityCatalog({ kind }: { kind: "events" | "clubs" }) {
  const [items, setItems] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(false);
    getDocs(collection(firebaseClient().db, kind))
      .then((snapshot) => {
        if (!alive) return;
        const data = snapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }) as CommunityItem)
          .filter((item) => !item.deleted);
        data.sort((a, b) =>
          kind === "events"
            ? Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
              Date.parse(b.startDate || "") - Date.parse(a.startDate || "")
            : (a.name || "").localeCompare(b.name || "", "ro"),
        );
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        if (alive) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, [kind, retry]);
  const filtered = items.filter(
    (item) =>
      (!category || item.category === category) &&
      (!status || eventStatus(item) === status),
  );
  const categories = [
    ...new Set(
      items
        .map((item) => item.category)
        .filter((value): value is string => Boolean(value)),
    ),
  ];
  return (
    <div className="app-container community-catalog">
      {kind === "events" ? (
        <div className="catalog-filters">
          <label>
            Categorie
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Toate categoriile</option>
              {categories.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Perioadă
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Toate evenimentele</option>
              <option value="upcoming">Urmează</option>
              <option value="ongoing">În desfășurare</option>
              <option value="past">Încheiate</option>
            </select>
          </label>
        </div>
      ) : null}
      {loading ? (
        <p className="catalog-status" role="status">
          Se încarcă {kind === "events" ? "evenimentele" : "cluburile"}…
        </p>
      ) : error ? (
        <div className="catalog-status" role="alert">
          <p>Nu s-a putut încărca lista.</p>
          <button
            className="app-button secondary"
            onClick={() => setRetry((value) => value + 1)}
          >
            Încearcă din nou
          </button>
        </div>
      ) : !filtered.length ? (
        <p className="catalog-status">
          Nu sunt {kind === "events" ? "evenimente" : "cluburi"} pentru selecția
          curentă.
        </p>
      ) : (
        <div className="community-grid">
          {filtered.map((item) => (
            <a
              key={item.id}
              className="community-card"
              href={`/${kind === "events" ? "eveniment" : "club"}/?id=${encodeURIComponent(item.id)}`}
            >
              {item.image ? (
                <img
                  className="community-card-image"
                  src={safeImage(item.image)}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <div className="community-card-placeholder" aria-hidden>
                  <Users size={48} />
                </div>
              )}
              <div className="community-card-copy">
                <span className="section-eyebrow">
                  {kind === "events"
                    ? item.category || "Eveniment"
                    : "Comunitatea CMIEA"}
                </span>
                <h2>{item.title || item.name}</h2>
                <p className="line-clamp-3">{item.description}</p>
                <div className="community-card-bottom">
                  <span>
                    <CalendarDays size={17} />
                    {kind === "clubs"
                      ? item.schedule || "Vezi programul"
                      : formatDate(item.startDate)}
                  </span>
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
function formatDate(value?: string) {
  const date = new Date(value || "");
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString("ro-RO", { dateStyle: "medium" })
    : "Dată de anunțat";
}
