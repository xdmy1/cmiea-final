import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { load } from "cheerio";
import { legacyDocument } from "../lib/legacy.ts";
import { eventStatus } from "../lib/catalog.ts";

test("login and registration retain their head modules, forms and reset dialog", async () => {
  for (const page of ["login", "register", "register-step2"]) {
    const document = await legacyDocument(page);
    assert(
      document.scripts.some(
        (script) => script.src === `/legacy/js/${page}.js` && script.module,
      ),
    );
    assert(load(document.html)("form").length > 0);
  }
  assert.match((await legacyDocument("login")).html, /id="resetModal"/);
});
test("admin migration preserves every original form and dialog", async () => {
  const source = load(await readFile("admin.html", "utf8"));
  const migrated = load((await legacyDocument("admin")).html);
  const ids = source('form[id], [id$="Modal"]')
    .map((_, element) => source(element).attr("id"))
    .get();
  for (const id of ids)
    assert.equal(
      migrated(`[id="${id}"]`).length,
      1,
      `${id} is retained exactly once`,
    );
  for (const section of [
    "course",
    "enrollment",
    "users",
    "events",
    "eventRegistrations",
    "clubs",
    "clubRegistrations",
  ])
    assert.equal(migrated(`#${section}Section`).length, 1);
  assert.equal(migrated("[data-section]").length, 0);
  assert.equal(migrated("#admin-menu-toggle").length, 0);
});
test("course detail retains the enrollment module and content targets inside the shared site layout", async () => {
  const document = await legacyDocument("curs");
  const $ = load(document.html);
  for (const id of [
    "course-details-container",
    "learn-section",
    "desktop-schedule",
    "mobile-schedule",
    "faq-container",
  ])
    assert.equal($("#" + id).length, 1);
  assert.equal($("nav,footer").length, 0);
  assert.equal($(".course-detail-section").length, 3);
  assert(
    document.scripts.some(
      (script) => script.src === "/legacy/js/curs.js" && script.module,
    ),
  );
  assert.equal(
    await readFile("public/js/curs.js", "utf8"),
    await readFile("js/curs.js", "utf8"),
  );
});
test("native news cards have real local images and explicit public source links", async () => {
  const posts = JSON.parse(await readFile("content/news.json", "utf8"));
  assert.equal(posts.length, 4);
  assert.equal(new Set(posts.map((post) => post.id)).size, posts.length);
  for (const post of posts) {
    assert.equal(post.sourceName, "Pretura sectorului Rîșcani");
    assert.equal(post.platform, "Facebook");
    assert.equal(new URL(post.url).hostname, "www.facebook.com");
    assert.match(new URL(post.url).pathname, /\/posts\/pfbid/);
    assert.equal(new URL(post.sourceUrl).hostname, "rascani.md");
    assert(Number.isFinite(Date.parse(post.publishedAt)));
    if (post.image) await access("." + post.image);
  }
});

test("redesigned admin forms retain every persisted control and a single dialog with external submit controls", async () => {
  const source = load(await readFile("admin.html", "utf8"));
  const migrated = load((await legacyDocument("admin")).html);
  for (const prefix of ["course", "event", "club"]) {
    const formId = prefix + "Form";
    for (const element of source(
      `#${formId} input:not([type="radio"]), #${formId} select, #${formId} textarea`,
    ).get()) {
      const id = source(element).attr("id"),
        name = source(element).attr("name");
      const found = id
        ? migrated(`#${formId} [id="${id}"]`)
        : migrated(`#${formId} [name="${name}"]`);
      assert.equal(found.length, 1, `${formId}: ${id || name} retained once`);
      assert.equal(found.attr("name"), name);
    }
    assert.equal(migrated(`#${prefix}Modal .fixed`).length, 0);
    assert.equal(migrated(`#${prefix}Modal`).attr("role"), "dialog");
    assert.equal(
      migrated(
        `#${prefix}Modal .admin-dialog-footer button[type="submit"][form="${formId}"]`,
      ).length,
      1,
    );
    assert(migrated(`#${formId} fieldset`).length >= 2);
  }
});

test("archived events have past dates, unique detail routes, local posters and public sources", async () => {
  const events = JSON.parse(await readFile("content/events.json", "utf8"));
  assert.equal(events.length, 3);
  assert.equal(
    new Set(events.map((event) => event.archiveSlug)).size,
    events.length,
  );
  for (const event of events) {
    assert.equal(
      eventStatus(event, Date.parse("2026-10-21T12:00:00Z")),
      "past",
    );
    assert.match(event.archiveSlug, /^[a-z0-9-]+$/);
    assert(event.details.length > 0);
    assert(
      event.sources.some(
        (source) => new URL(source.url).hostname === "chisinauedu.dgets.md",
      ),
    );
    for (const source of event.sources)
      assert.equal(new URL(source.url).protocol, "https:");
    await access("." + event.image);
  }
});
