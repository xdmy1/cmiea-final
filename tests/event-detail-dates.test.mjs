import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { Timestamp } from "firebase/firestore";

async function eventHelpers() {
  // The legacy script's startup only registers handlers. Keep those external
  // browser/Firebase boundaries inert while exercising its real date helpers.
  const context = {
    firebase: {
      initializeApp() {},
      firestore() {
        return {};
      },
      auth() {
        return {};
      },
    },
    document: {
      getElementById() {
        return { addEventListener() {} };
      },
      addEventListener() {},
    },
    console: { log() {} },
  };
  runInNewContext(await readFile("js/eveniment.js", "utf8"), context);
  return context;
}
test("live event detail dates display Firestore timestamps as dates", async () => {
  const helpers = await eventHelpers();
  const date = Timestamp.fromDate(new Date("2026-10-21T12:00:00Z"));
  assert.match(helpers.formatEventDate(date), /21 octombrie 2026/);
});
test("live event durations use the timestamp range instead of displaying NaN", async () => {
  const helpers = await eventHelpers();
  assert.equal(
    helpers.formatEventDuration(
      Timestamp.fromDate(new Date("2026-10-21T12:00:00Z")),
      Timestamp.fromDate(new Date("2026-10-21T13:30:00Z")),
    ),
    "1h 30m",
  );
});
