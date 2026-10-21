"use client";
import { FilterSelect } from "./filter-select";
import { sitePath } from "@/lib/site-path";

import { useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import {
  Clock,
  Users,
  Target,
  CalendarDays,
  Search,
  ArrowRight,
} from "lucide-react";
import { firebaseClient } from "@/lib/firebase";
import {
  filterCourses,
  formatCoursePeriod,
  safeImage,
  type Course,
} from "@/lib/catalog";

const pageSize = 6;
export function CourseCatalog({
  home = false,
  original = false,
}: {
  home?: boolean;
  original?: boolean;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    duration: "",
    language: "",
  });
  const results = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true;
    const { db } = firebaseClient();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const snapshot = await getDocs(collection(db, "courses"));
        const values = snapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }) as Course)
          .sort((a, b) => (a.name || "").localeCompare(b.name || "", "ro"));
        if (alive) {
          setCourses(values);
          setLoading(false);
        }
        // Aggregation returns counts without transferring enrolment records.
        const counts = await Promise.all(
          values.map(async (course) => {
            try {
              const snapshot = await getCountFromServer(
                query(
                  collection(db, "enrollments"),
                  where("courseId", "==", course.id),
                  where("status", "==", "approved"),
                ),
              );
              return {
                ...course,
                remainingSpots: Math.max(
                  0,
                  Number(course.locuri || 0) - snapshot.data().count,
                ),
              };
            } catch {
              return { ...course, remainingSpots: null };
            }
          }),
        );
        if (alive) setCourses(counts);
      } catch {
        if (alive) {
          setError("Cursurile nu au putut fi încărcate. Încearcă din nou.");
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      alive = false;
    };
  }, [retry]);
  const filtered = filterCourses(courses, filters);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const options = (field: "categorie" | "durata" | "limba") =>
    [
      ...new Set(
        courses
          .map((course) => course[field])
          .filter((value): value is string => Boolean(value)),
      ),
    ].sort((a, b) => a.localeCompare(b, "ro"));
  function change(key: keyof typeof filters, value: string) {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(1);
  }
  function changePage(next: number, keyboard: boolean) {
    setPage(next);
    requestAnimationFrame(() =>
      results.current?.scrollIntoView({
        block: "start",
        behavior:
          keyboard || matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
      }),
    );
  }
  return (
    <section
      className={
        original
          ? "original-course-catalog app-container"
          : "app-container catalog"
      }
      id="cursuri"
      aria-labelledby="catalog-title"
    >
      {original ? (
        <h1
          id="catalog-title"
          className="text-3xl lg:text-5xl font-semibold mb-4"
        >
          <span className="text-main dark:text-maindark">Cursurile</span>{" "}
          noastre
        </h1>
      ) : (
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">Învață ceva nou</p>
            <h2 id="catalog-title">
              {home ? "Cursurile noastre" : "Găsește cursul potrivit"}
            </h2>
          </div>
          {home ? (
            <a href={sitePath("/cursuri/")} className="text-link">
              Toate cursurile <ArrowRight size={18} />
            </a>
          ) : null}
        </div>
      )}
      <div
        className={
          original
            ? "catalog-filters original-course-filters"
            : "catalog-filters"
        }
      >
        {!original ? (
          <label className="catalog-search-field">
            <span>Caută cursuri</span>
            <span className="catalog-search">
              <Search size={18} aria-hidden />
              <input
                value={filters.search}
                onChange={(event) => change("search", event.target.value)}
                placeholder="Caută un curs..."
                type="search"
              />
            </span>
          </label>
        ) : null}
        <div className="catalog-filter-field">
          <span>{original ? "Categorie:" : "Nivel"}</span>
          <FilterSelect
            label={original ? "Categorie" : "Nivel"}
            value={filters.category}
            onChange={(value) => change("category", value)}
            options={[
              {
                value: "",
                label: original ? "Toate categoriile" : "Toate nivelurile",
              },
              ...options("categorie").map((value) => ({ value, label: value })),
            ]}
          />
        </div>
        <div className="catalog-filter-field">
          <span>Durată</span>
          <FilterSelect
            label="Durată"
            value={filters.duration}
            onChange={(value) => change("duration", value)}
            options={[
              { value: "", label: "Toate duratele" },
              ...options("durata").map((value) => ({ value, label: value })),
            ]}
          />
        </div>
        <div className="catalog-filter-field">
          <span>Limbă</span>
          <FilterSelect
            label="Limbă"
            value={filters.language}
            onChange={(value) => change("language", value)}
            options={[
              { value: "", label: "Toate limbile" },
              ...options("limba").map((value) => ({ value, label: value })),
            ]}
          />
        </div>
      </div>
      {loading ? (
        <p className="catalog-status" role="status">
          Se încarcă cursurile…
        </p>
      ) : error ? (
        <div className="catalog-status" role="alert">
          <p>{error}</p>
          <button
            className="app-button secondary"
            onClick={() => setRetry((value) => value + 1)}
          >
            Încearcă din nou
          </button>
        </div>
      ) : (
        <>
          <div className="catalog-results" ref={results}>
            {visible.length ? (
              <div className="course-grid">
                {visible.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <p className="catalog-status">
                Nu am găsit cursuri pentru filtrele alese.
              </p>
            )}
          </div>
          {pages > 1 ? (
            <Pagination
              page={page}
              pages={pages}
              change={changePage}
              position="jos"
            />
          ) : null}
        </>
      )}
    </section>
  );
}
function Pagination({
  page,
  pages,
  change,
  position,
}: {
  page: number;
  pages: number;
  change: (page: number, keyboard: boolean) => void;
  position: string;
}) {
  return (
    <nav
      className="catalog-pagination"
      aria-label={`Pagini de cursuri — ${position}`}
    >
      <button
        disabled={page === 1}
        onClick={(event) => change(page - 1, event.detail === 0)}
      >
        Înapoi
      </button>
      <span aria-live="polite">
        {page} / {pages}
      </span>
      <button
        disabled={page === pages}
        onClick={(event) => change(page + 1, event.detail === 0)}
      >
        Înainte
      </button>
    </nav>
  );
}
function CourseCard({ course }: { course: Course }) {
  return (
    <a
      href={sitePath(`/curs/?id=${encodeURIComponent(course.id)}`)}
      className="course-card"
    >
      <div className="course-card-heading">
        <img
          src={safeImage(course.image)}
          alt=""
          width={48}
          height={48}
          loading="lazy"
        />
        <h2 className="line-clamp-2">{course.name || "Curs fără nume"}</h2>
      </div>
      <p className="course-card-description line-clamp-3">
        {course.description}
      </p>
      <div className="course-card-details">
        <span>
          <Clock aria-hidden size={19} />
          <span>{course.ore || 0} ore</span>
        </span>
        <span>
          <Users aria-hidden size={19} />
          <span>
            {course.remainingSpots == null
              ? "Vezi disponibilitatea"
              : `${course.remainingSpots} locuri rămase`}
          </span>
        </span>
        <span>
          <Target aria-hidden size={19} />
          <span>{course.categorie || "Începător"}</span>
        </span>
        <span>
          <CalendarDays aria-hidden size={19} />
          <span>{formatCoursePeriod(course.perioada)}</span>
        </span>
      </div>
    </a>
  );
}
