import { sitePath } from "./site-path.ts";
export type Course = {
  id: string;
  name?: string;
  description?: string;
  image?: string;
  ore?: number;
  categorie?: string;
  perioada?: string;
  durata?: string;
  limba?: string;
  locuri?: number;
  remainingSpots?: number | null;
};
export type CommunityItem = {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  image?: string;
  category?: string;
  schedule?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  featured?: boolean;
  deleted?: boolean;
  archiveSlug?: string;
};

export function filterCourses(
  courses: Course[],
  filters: {
    search: string;
    category: string;
    duration: string;
    language: string;
  },
) {
  const search = filters.search.trim().toLocaleLowerCase("ro");
  return courses.filter(
    (course) =>
      (!search ||
        `${course.name || ""} ${course.description || ""}`
          .toLocaleLowerCase("ro")
          .includes(search)) &&
      (!filters.category || course.categorie === filters.category) &&
      (!filters.duration || course.durata === filters.duration) &&
      (!filters.language || course.limba === filters.language),
  );
}
export function safeImage(image?: string) {
  if (!image) return sitePath("/assets/course-img.png");
  if (image.startsWith("assets/")) return sitePath("/" + image);
  if (/^(https?:\/\/|\/assets\/|\/formatori\/)/i.test(image))
    return sitePath(image);
  return sitePath("/assets/course-img.png");
}
const shortMonths: Record<string, string> = {
  ianuarie: "Ian",
  februarie: "Feb",
  martie: "Mar",
  aprilie: "Apr",
  mai: "Mai",
  iunie: "Iun",
  iulie: "Iul",
  august: "Aug",
  septembrie: "Sept",
  octombrie: "Oct",
  noiembrie: "Nov",
  decembrie: "Dec",
};
export function formatCoursePeriod(value?: string) {
  if (!value?.trim()) return "Perioadă neanunțată";
  return value
    .trim()
    .replace(
      /(?<!\p{L})(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)(?!\p{L})/giu,
      (month) => shortMonths[month.toLocaleLowerCase("ro")],
    );
}
export function eventStatus(item: CommunityItem, now = Date.now()) {
  const start = Date.parse(item.startDate || "");
  const end = Date.parse(item.endDate || item.startDate || "");
  if (!Number.isFinite(start)) return "unknown";
  return now > end ? "past" : now >= start ? "ongoing" : "upcoming";
}

export function mergeEvents(live: CommunityItem[], archive: CommunityItem[]) {
  const eventKey = (item: CommunityItem) =>
    `${(item.title || item.name || "").trim().toLocaleLowerCase("ro")}::${(item.startDate || "").slice(0, 10)}`;
  const liveIds = new Set(live.map((item) => item.id));
  const liveKeys = new Set(live.map(eventKey));
  return [
    ...live,
    ...archive.filter(
      (item) => !liveIds.has(item.id) && !liveKeys.has(eventKey(item)),
    ),
  ]
    .filter((item) => !item.deleted)
    .sort(
      (a, b) =>
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        (Date.parse(b.startDate || "") || 0) -
          (Date.parse(a.startDate || "") || 0),
    );
}
