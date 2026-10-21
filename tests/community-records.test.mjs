import test from "node:test";
import assert from "node:assert/strict";
import { Timestamp } from "firebase/firestore";
import { mergeEvents, eventStatus } from "../lib/catalog.ts";

test("live Firestore timestamps merge with archived events without crashing the community page", () => {
  const live = [
    {
      id: "live",
      title: "Întâlnire",
      startDate: Timestamp.fromDate(new Date("2026-10-21T12:00:00Z")),
    },
  ];
  const archive = [
    { id: "archive", title: "Întâlnire", startDate: "2026-10-21T12:00:00Z" },
  ];
  assert.deepEqual(
    mergeEvents(live, archive).map((item) => item.id),
    ["live"],
  );
});
test("community status filters understand Firestore timestamp date ranges", () => {
  const now = Date.parse("2026-10-21T12:00:00Z");
  assert.equal(
    eventStatus(
      {
        id: "live",
        startDate: Timestamp.fromDate(new Date("2026-10-21T11:00:00Z")),
        endDate: Timestamp.fromDate(new Date("2026-10-21T13:00:00Z")),
      },
      now,
    ),
    "ongoing",
  );
});
test("deleted live records still suppress their matching archive entry when dates are timestamps", () => {
  const live = [
    {
      id: "live",
      title: "Întâlnire",
      deleted: true,
      startDate: Timestamp.fromDate(new Date("2026-10-21T12:00:00Z")),
    },
  ];
  const archive = [
    { id: "archive", title: "Întâlnire", startDate: "2026-10-21T12:00:00Z" },
  ];
  assert.deepEqual(mergeEvents(live, archive), []);
});
