import { access, readFile, readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { load } from "cheerio";

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
const failures = [];
let pages = 0,
  references = 0;
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (
        !["_next", "assets", "formatori", "js", "legacy", "css"].includes(
          entry.name,
        )
      )
        await visit(file);
      continue;
    }
    if (extname(file) !== ".html") continue;
    const $ = load(await readFile(file, "utf8"));
    const base = new URL(
      $("base").attr("href") || prefix + "/",
      "https://preview.test",
    );
    pages++;
    for (const element of $("[href], [src]").get()) {
      const node = $(element);
      if (/^(preconnect|dns-prefetch)$/.test(node.attr("rel") || "")) continue;
      const value = node.attr("href") || node.attr("src");
      if (!value || /^(#|data:|mailto:|tel:|javascript:)/.test(value)) continue;
      const url = new URL(value, base);
      if (url.origin !== base.origin) continue;
      references++;
      if (
        prefix &&
        !url.pathname.startsWith(prefix + "/") &&
        url.pathname !== prefix
      ) {
        failures.push({ file, value, error: "URL missing deployment prefix" });
        continue;
      }
      let target =
        "out" + decodeURIComponent(url.pathname.slice(prefix.length));
      try {
        if ((await stat(target)).isDirectory()) target += "/index.html";
        await access(target);
      } catch {
        failures.push({ file, value, error: "Missing exported resource" });
      }
    }
  }
}
await visit("out");
if (prefix)
  for (const file of await readdir("out"))
    if (/^CNAME(?:\s|$)/.test(file))
      failures.push({ file, error: "Custom domain file in preview" });
console.log(JSON.stringify({ pages, references, failures }));
if (failures.length) process.exitCode = 1;
