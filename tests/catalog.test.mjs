import test from "node:test";
import assert from "node:assert/strict";
import {
  filterCourses,
  formatCoursePeriod,
  safeImage,
  eventStatus,
} from "../lib/catalog.ts";

test("search and all course filters apply together without changing source data", () => {
  const courses = [
    {
      id: "1",
      name: "Limba ENGLEZĂ",
      categorie: "Începător",
      durata: "3 Luni",
      limba: "Română",
    },
    {
      id: "2",
      name: "Limba engleză",
      categorie: "Avansat",
      durata: "3 Luni",
      limba: "Română",
    },
    {
      id: "3",
      name: "Contabilitate",
      categorie: "Începător",
      durata: "1 Lună",
      limba: "Română",
    },
  ];
  assert.deepEqual(
    filterCourses(courses, {
      search: " engleză ",
      category: "Începător",
      duration: "3 Luni",
      language: "Română",
    }).map((course) => course.id),
    ["1"],
  );
  assert.equal(courses.length, 3);
});
test("every Romanian month is abbreviated while years and periods are retained", () => {
  assert.equal(
    formatCoursePeriod("Februarie - Aprilie 2027"),
    "feb - apr 2027",
  );
  assert.equal(
    formatCoursePeriod(
      "IANUARIE Februarie Martie Aprilie Mai Iunie Iulie August Septembrie Octombrie Noiembrie Decembrie",
    ),
    "ian feb mar apr mai iun iul aug sept oct nov dec",
  );
  assert.equal(
    formatCoursePeriod("decembrie 2026 – ianuarie 2027"),
    "dec 2026 – ian 2027",
  );
  assert.equal(formatCoursePeriod(""), "Perioadă neanunțată");
});
test("course images accept existing local assets and https images", () => {
  assert.equal(safeImage("assets/icon.png"), "/assets/icon.png");
  assert.equal(
    safeImage("https://example.com/image.jpg"),
    "https://example.com/image.jpg",
  );
  assert.equal(safeImage("javascript:alert(1)"), "/assets/course-img.png");
});
test("event statuses handle future, current, finished and missing dates", () => {
  const now = Date.parse("2026-10-21T12:00:00Z");
  assert.equal(
    eventStatus({ id: "1", startDate: "2026-10-22T10:00:00Z" }, now),
    "upcoming",
  );
  assert.equal(
    eventStatus(
      {
        id: "1",
        startDate: "2026-10-21T10:00:00Z",
        endDate: "2026-10-21T14:00:00Z",
      },
      now,
    ),
    "ongoing",
  );
  assert.equal(
    eventStatus({ id: "1", startDate: "2026-10-20T10:00:00Z" }, now),
    "past",
  );
  assert.equal(eventStatus({ id: "1" }, now), "unknown");
});
