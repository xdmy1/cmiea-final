import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { load } from "cheerio";
import { legacyDocument } from "../lib/legacy.ts";
import { GET } from "../app/curs/route.ts";

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
test("course clean route preserves the full original document", async () => {
  const original = await readFile("curs.html", "utf8");
  const response = await GET();
  assert.equal(
    response.headers.get("Content-Type"),
    "text/html; charset=utf-8",
  );
  assert.equal(
    (await response.text()).replace('<head>\n<base href="/">', "<head>"),
    original,
  );
  assert.equal(
    await readFile("public/js/curs.js", "utf8"),
    await readFile("js/curs.js", "utf8"),
  );
});
test("native news cards have real local images and explicit public source links", async () => {
  const posts = JSON.parse(await readFile("content/news.json", "utf8"));
  assert.equal(posts.length, 6);
  assert.equal(new Set(posts.map((post) => post.id)).size, posts.length);
  for (const post of posts) {
    assert.equal(post.sourceName, "Primăria Chișinău");
    assert.equal(new URL(post.url).hostname, "t.me");
    assert(Number.isFinite(Date.parse(post.publishedAt)));
    await access("." + post.image);
  }
});
