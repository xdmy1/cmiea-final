"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ArrowUpRight, CalendarDays, Users } from "lucide-react";
import { firebaseClient } from "@/lib/firebase";
import {
  eventStatus,
  mergeEvents,
  safeImage,
  type CommunityItem,
} from "@/lib/catalog";
import archivedEvents from "@/content/events.json";
import { FilterSelect } from "./filter-select";
import { normalizeCommunityItem } from "@/lib/community-records";
import { sitePath } from "@/lib/site-path";

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
    const timer = setTimeout(() => {
      if (alive) {
        setError(true);
        setLoading(false);
      }
    }, 15000);
    async function load() {
      try {
        const snapshot = await getDocs(collection(firebaseClient().db, kind));
        if (!alive) return;
        const data = snapshot.docs.map((doc) =>
          normalizeCommunityItem(doc.data(), doc.id),
        );
        if (kind === "clubs")
          data.sort((a, b) => a.name.localeCompare(b.name, "ro"));
        setItems(data);
        setError(false);
      } catch {
        if (alive) setError(true);
      } finally {
        clearTimeout(timer);
        if (alive) setLoading(false);
      }
    }
    void load();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [kind, retry]);
  const visibleItems =
    kind === "events"
      ? mergeEvents(items, archivedEvents)
      : items.filter(
          (item) =>
            !item.deleted &&
            item.name?.trim().toLocaleLowerCase("ro") !== "test",
        );
  const filtered = visibleItems.filter(
    (item) =>
      (!category || item.category === category) &&
      (!status || eventStatus(item) === status),
  );
  const categories = [
    ...new Set(
      visibleItems
        .map((item) => item.category)
        .filter((value): value is string => Boolean(value)),
    ),
  ];
  return (
    <div className="app-container community-catalog" aria-busy={loading}>
      {kind === "clubs" ? <ClubUpdate /> : null}
      {kind === "events" ? (
        <div className="catalog-filters">
          <div className="catalog-filter-field">
            <span>Categorie</span>
            <FilterSelect
              label="Categorie"
              value={category}
              onChange={setCategory}
              options={[
                { value: "", label: "Toate categoriile" },
                ...categories.map((value) => ({ value, label: value })),
              ]}
            />
          </div>
          <div className="catalog-filter-field">
            <span>Perioadă</span>
            <FilterSelect
              label="Perioadă"
              value={status}
              onChange={setStatus}
              options={[
                { value: "", label: "Toate evenimentele" },
                { value: "upcoming", label: "Urmează" },
                { value: "ongoing", label: "În desfășurare" },
                { value: "past", label: "Încheiate" },
              ]}
            />
          </div>
        </div>
      ) : null}
      {loading && !visibleItems.length ? (
        <p className="catalog-status" role="status">
          Se încarcă {kind === "events" ? "evenimentele" : "cluburile"}…
        </p>
      ) : null}
      {error ? (
        <div className="community-load-error" role="alert">
          <p>
            {visibleItems.length
              ? "Lista actualizată nu s-a putut încărca. Evenimentele din arhivă sunt disponibile mai jos."
              : "Nu s-a putut încărca lista."}
          </p>
          <button
            className="app-button secondary"
            onClick={() => setRetry((value) => value + 1)}
          >
            Încearcă din nou
          </button>
        </div>
      ) : null}
      {!filtered.length && !loading && !error ? (
        <p className="catalog-status">
          Nu sunt {kind === "events" ? "evenimente" : "cluburi"} pentru selecția
          curentă.
        </p>
      ) : null}
      {filtered.length ? (
        <div className="community-grid">
          {filtered.map((item) => (
            <a
              key={item.id}
              className="community-card"
              href={sitePath(
                item.archiveSlug
                  ? `/evenimente/arhiva/${item.archiveSlug}/`
                  : `/${kind === "events" ? "eveniment" : "club"}/?id=${encodeURIComponent(item.id)}`,
              )}
            >
              {item.image ? (
                <img
                  className={`community-card-image${item.archiveSlug ? " event-poster" : ""}`}
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
                <div className="community-card-labels">
                  <span className="section-eyebrow">
                    {kind === "events"
                      ? item.category || "Eveniment"
                      : "Comunitatea CMIEA"}
                  </span>
                  {kind === "events" && eventStatus(item) === "past" ? (
                    <span className="event-status">Încheiat</span>
                  ) : null}
                </div>
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
      ) : null}
    </div>
  );
}

function ClubUpdate() {
  return (
    <aside className="club-update" aria-labelledby="club-update-title">
      <div className="club-update-copy">
        <span className="section-eyebrow">
          Noutăți din comunitate · octombrie 2026
        </span>
        <h2 id="club-update-title">Cluburile de interes CMIEA</h2>
        <p>
          Programul publicat pe Facebook anunță 14 ședințe gratuite în
          octombrie, cu activități de leadership, sănătate, yoga, tehnologie și
          creație.
        </p>
        <div className="club-update-links">
          <a
            className="app-button"
            href="https://forms.gle/Fn6cJ5RGDb7vZfMh7"
            target="_blank"
            rel="noreferrer"
          >
            Formular de înscriere <ArrowUpRight size={17} />
          </a>
          <a
            className="club-update-source"
            href="https://www.facebook.com/Pretura.sectorului.riscani/posts/pfbid02E2pKYKysBuHKag666Zq7H9vuB4KUJV3B9CTPaV2TmtV18iAG48B9taF97JDXsv3Nl"
            target="_blank"
            rel="noreferrer"
          >
            Vezi anunțul pe Facebook <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
      <a
        className="club-update-poster-link"
        href="https://www.facebook.com/Pretura.sectorului.riscani/posts/pfbid02E2pKYKysBuHKag666Zq7H9vuB4KUJV3B9CTPaV2TmtV18iAG48B9taF97JDXsv3Nl"
        target="_blank"
        rel="noreferrer"
        aria-label="Deschide afișul programului cluburilor din octombrie pe Facebook"
      >
        <img
          className="club-update-poster"
          src={sitePath("/assets/news/68935.jpg")}
          alt="Programul cluburilor CMIEA din octombrie 2026, cu datele și orele întâlnirilor"
          loading="lazy"
        />
      </a>
    </aside>
  );
}

function formatDate(value?: string) {
  const date = new Date(value || "");
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString("ro-RO", {
        dateStyle: "medium",
        timeZone: "Europe/Chisinau",
      })
    : "Dată de anunțat";
}
